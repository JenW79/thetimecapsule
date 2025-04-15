from flask import Blueprint, jsonify, request, session
from flask_login import login_required, current_user
from app.models import db, CartItem, Product
from app.forms import OrderForm
import re

cart_routes = Blueprint("cart", __name__)

@cart_routes.route("/cart")
def get_cart():
    cart_items_with_details = []

    if current_user.is_authenticated:
        cart_items = CartItem.query.filter_by(user_id=current_user.id).all()
        for item in cart_items:
            product = Product.query.get(item.product_id)
            if product:
                item_dict = item.to_dict()
                item_dict["product"] = {
                    "id": product.id,
                    "name": product.name,
                    "price": float(product.price),
                    "image_url": product.image_url,
                }
                cart_items_with_details.append(item_dict)
    else:
        cart_items = session.get("cart", [])
        for item in cart_items:
            product_id = item.get("product_id")
            product = Product.query.get(product_id)
            if product:
                item_dict = {
                    "id": item.get("id", product_id),
                    "product_id": product_id,
                    "quantity": item.get("quantity", 1),
                    "product": {
                        "id": product.id,
                        "name": product.name,
                        "price": float(product.price),
                        "image_url": product.image_url,
                    }
                }
                cart_items_with_details.append(item_dict)

    return jsonify(cart_items_with_details), 200


@cart_routes.route("/cart", methods=["POST"])
def add_to_cart():
    products = request.json
    for product in products:
        product_id = product.get("id")
        quantity = product.get("quantity", 1)
        product_obj = Product.query.get(product_id)
        if not product_obj:
            return jsonify({"error": "Product not found"}), 404

        if current_user.is_authenticated:
            cart_item = CartItem.query.filter_by(user_id=current_user.id, product_id=product_obj.id).first()
            if cart_item:
                cart_item.quantity += quantity
            else:
                cart_item = CartItem(user_id=current_user.id, product_id=product_obj.id, quantity=quantity)
                db.session.add(cart_item)
        else:
            cart = session.get("cart", [])
            existing_item = next((item for item in cart if item["product_id"] == product_obj.id), None)
            if existing_item:
                existing_item["quantity"] += quantity
            else:
                cart.append({
                    "id": product_obj.id,
                    "product_id": product_obj.id,
                    "name": product_obj.name,
                    "quantity": quantity,
                    "price": float(product_obj.price),
                    "image_url": product_obj.image_url,
                })
            session["cart"] = cart

    if current_user.is_authenticated:
        db.session.commit()

    return jsonify({"message": "Products added to cart"}), 201


@cart_routes.route("/cart/<int:item_id>", methods=["DELETE"])
def remove_item_from_cart(item_id):
    if current_user.is_authenticated:
        cart_item = CartItem.query.get_or_404(item_id)
        if cart_item.user_id != current_user.id:
            return jsonify({"message": "Item not found in your cart"}), 404
        db.session.delete(cart_item)
        db.session.commit()
        return jsonify({"message": "Item removed from cart"}), 200
    else:
        cart = session.get("cart", [])
        cart = [item for item in cart if item.get("id") != item_id and item.get("product_id") != item_id]
        session["cart"] = cart
        return jsonify({"message": "Item removed from cart"}), 200


@cart_routes.route("/cart", methods=["DELETE"])
def clear_cart():
    if current_user.is_authenticated:
        cart_items = CartItem.query.filter_by(user_id=current_user.id).all()
        for item in cart_items:
            db.session.delete(item)
        db.session.commit()
        return jsonify({"message": "Cart cleared"}), 200
    else:
        session["cart"] = []
        return jsonify({"message": "Cart cleared"}), 200


@cart_routes.route("/checkout", methods=["POST"])
@login_required
def submit_order():
    form = OrderForm(meta={"csrf": False})
    if not request.is_json:
        return jsonify({"error": "Invalid request format."}), 400

    form_data = request.json
    form.first_name.data = form_data.get("first_name")
    form.last_name.data = form_data.get("last_name")
    form.street_address.data = form_data.get("street_address")

    try:
        form.zip_code.data = int(form_data.get("zip_code", 0))
    except (ValueError, TypeError):
        return jsonify({"error": "Zip code must be a number"}), 400

    form.city.data = form_data.get("city")
    form.country.data = form_data.get("country")
    form.state.data = form_data.get("state")
    form.payment_method.data = form_data.get("payment_method")

    if form.payment_method.data in ["Credit Card", "Debit Card"]:
        form.expiration_date.data = form_data.get("expiration_date")
        form.cvv.data = form_data.get("cvv")
        form.card_number.data = form_data.get("card_number")

        if not re.match(r"^(0[1-9]|1[0-2])\/\d{2}$", form.expiration_date.data or ""):
            return jsonify({"error": "Expiration date must be in MM/YY format."}), 400
        if not re.match(r"^\d{3,4}$", form.cvv.data or ""):
            return jsonify({"error": "CVV must be 3 or 4 digits."}), 400
        if not re.match(r"^\d{16}$", form.card_number.data or ""):
            return jsonify({"error": "Card number must be exactly 16 digits."}), 400
    else:
        form.expiration_date.data = None
        form.cvv.data = None
        form.card_number.data = None

    if not form.validate():
        return jsonify({"error": "Form validation failed.", "details": form.errors}), 400

    order_data = {
        "first_name": form.first_name.data,
        "last_name": form.last_name.data,
        "street_address": form.street_address.data,
        "zip_code": form.zip_code.data,
        "city": form.city.data,
        "country": form.country.data,
        "state": form.state.data,
        "payment_method": form.payment_method.data,
    }

    cart_items = CartItem.query.filter_by(user_id=current_user.id).all()
    if not cart_items:
        return jsonify({"error": "Your cart is empty!"}), 400

    total_price = 0
    items_summary = []

    for item in cart_items:
        product = Product.query.get(item.product_id)
        if product:
            total_price += product.price * item.quantity
            items_summary.append({
                "product_id": product.id,
                "name": product.name,
                "quantity": item.quantity,
                "price": float(product.price)
            })
        db.session.delete(item)

    db.session.commit()

    return jsonify({
        "message": "Order form submitted successfully",
        "order_data": order_data,
        "cart_summary": {
            "total_price": total_price,
            "items": items_summary
        }
    }), 200
from flask import render_template, Blueprint, jsonify, request, session
from flask_login import login_required, current_user
from app.forms import OrderForm
from app.models import db, CartItem, Product
import re

cart_routes = Blueprint('cart', __name__)

# GET /cart
# Get all products that a user added to the shopping cart
@cart_routes.route("/cart")
def get_cart():
    if current_user.is_authenticated:
        cart_items = CartItem.query.filter_by(user_id=current_user.id).all()
        cart_items_with_details = []
        for item in cart_items:
            item_dict = item.to_dict()
            product = Product.query.get(item.product_id)
            if product:
                item_dict['price'] = product.price
                item_dict['name'] = product.name
            cart_items_with_details.append(item_dict)

        return jsonify({'cart_items': cart_items_with_details}), 200
    else:
        return jsonify({"cart_items": []}), 200


# POST /cart
# A user adds a new product to the shopping cart
@cart_routes.route("/cart", methods=["POST"])
def add_to_cart():
    print("POST request received at /api/cart")
    print("Request data:", request.json)
    product_id = request.json.get('product_id')
    quantity = request.json.get('quantity', 1)
    
    product = Product.query.get(product_id)
    
    if not product:
        return jsonify({"error": "Product not found"}), 404
    
    if current_user.is_authenticated:
        cart_item = CartItem.query.filter_by(user_id=current_user.id, product_id=product.id).first()
        
        if cart_item:
            cart_item.quantity += quantity
        else:
            cart_item = CartItem(user_id=current_user.id, product_id=product.id, quantity=quantity)
            
            db.session.add(cart_item)
        
        db.session.commit()
        return jsonify({"message": "Product added to cart"}), 201
    else:
        return jsonify({
            "message": "Product added to cart",
            "product": {
                'product_id': product.id,
                'name': product.name,
                'quantity': quantity,
                'price': product.price
            }
        }), 201


# DELETE /cart/:item_id
# A user removes an item from the shopping cart
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
        return jsonify({"message": "Item removed from cart"}), 200


# POST /checkout
# A user submits the order form
@cart_routes.route("/checkout", methods=["POST"])
@login_required
def submit_order():
    print("Received checkout data:", request.json)
    form = OrderForm(meta={'csrf': False})
    if request.is_json:
        form_data = request.json
        form.first_name.data = form_data.get('first_name')
        form.last_name.data = form_data.get('last_name')
        form.street_address.data = form_data.get('street_address')
        try:
            form.zip_code.data = int(form_data.get('zip_code', 0))
        except (ValueError, TypeError):
            return jsonify({"error": "Zip code must be a number"}), 400
            
        form.city.data = form_data.get('city')
        form.country.data = form_data.get('country')
        form.state.data = form_data.get('state')
        form.payment_method.data = form_data.get('payment_method')
        form.expiration_date.data = form_data.get('expiration_date')
        form.cvv.data = form_data.get('cvv')
        form.card_number.data = form_data.get('card_number')
        expiration_date = form.expiration_date.data
        if not re.match(r"^(0[1-9]|1[0-2])\/\d{2}$", expiration_date):
            return jsonify({"error": "Expiration date must be in MM/YY format."}), 400

        cvv = form.cvv.data
        if not re.match(r"^\d{3,4}$", cvv):
            return jsonify({"error": "CVV must be 3 or 4 digits."}), 400

        card_number = form.card_number.data
        if not re.match(r"^\d{16}$", card_number):
            return jsonify({"error": "Card number must be exactly 16 digits."}), 400

        if form.validate():
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
                        'product_id': product.id,
                        'name': product.name,
                        'quantity': item.quantity,
                        'price': product.price
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
        else:
            print("Form validation errors:", form.errors)
            return jsonify({"error": "Form validation failed.", "details": form.errors}), 400

    return jsonify({"error": "Invalid request format."}), 400

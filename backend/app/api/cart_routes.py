from flask import render_template, Blueprint, jsonify, request, session
from flask_login import login_required, current_user
from ..forms import OrderForm
from ..models import CartItem
from .. import db

cart_routes = Blueprint('cart', __name__)

# GET /cart
# Get all products that a user added to the shopping cart
@cart_routes.route("/cart")
def get_cart():
    if current_user.is_authenticated:
        cart_items = CartItem.query.filter_by(user_id=current_user.id).all()
        return jsonify({'cart_items': [item.to_dict() for item in cart_items]}), 200
    else:
        return jsonify({"cart_items": []}), 200


# POST /cart
# A user adds a new product to the shopping cart
@cart_routes.route("/cart", methods=["POST"])
def add_to_cart():
    product_id = request.json.get('product_id')
    quantity = request.json.get('quantity', 1)
    
    product = Product.query.get_or_404(product_id)

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
    form = OrderForm()
    
    if form.validate_on_submit():

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

        total_price = sum(item.product.price * item.quantity for item in cart_items)

        return jsonify({
            "message": "Order form submitted successfully",
            "order_data": order_data,
            "cart_summary": {
                "total_price": total_price,
                "items": [{
                    'product_id': item.product.id,
                    'name': item.product.name,
                    'quantity': item.quantity,
                    'price': item.product.price
                } for item in cart_items]
            }
        }), 200

    return jsonify({"error": "Form validation failed."}), 400
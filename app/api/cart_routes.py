from flask import render_template, Blueprint, jsonify, request, flash, redirect, url_for, session
from flask_login import login_required, current_user
from app.forms import OrderForm
# from app.models import Product, CartItem
from app.models import CartItem
from app import db

cart_routes = Blueprint('cart', __name__)

# GET /cart
# get all products that a user added to the shopping cart

@cart_routes.route("/cart")
def cart_page():
    # # Fetch the user's cart from the database (or create one if not exists)
    # cart = Cart.query.filter_by(user_id=current_user.id).first()
    # OR
    if current_user.is_authenticated:
        # If the user is logged in, fetch the cart from the database
        cart = Cart.query.filter_by(user_id=current_user.id).first()
    
    # if not cart:
    #     # Create a new cart if it doesn't exist
    #     cart = Cart(user_id=current_user.id)
    #     db.session.add(cart)
    #     db.session.commit()
    # OR
        if not cart:
            # Create a new cart if it doesn't exist
            cart = Cart(user_id=current_user.id)
            db.session.add(cart)
            db.session.commit()

    # # Fetch the items in the user's cart
    # cart_items = CartItem.query.filter_by(cart_id=cart.id).all()
    # OR
        # Fetch the items in the user's cart
        cart_items = CartItem.query.filter_by(cart_id=cart.id).all()

    else:
        # For guests, use session to store cart data
        cart_items = session.get('cart_items', [])

    return render_template('cart_page.html', cart_items=cart_items)

# POST /cart
# a user adds a new product to the shopping cart

@cart_routes.route("/cart", methods=["POST"])
def add_to_cart():
    product_id = request.json.get('product_id')
    quantity = request.json.get('quantity', 1)
    
    # Fetch the product from the database
    product = Product.query.get_or_404(product_id)

    # # Get the user's cart
    # cart = Cart.query.filter_by(user_id=current_user.id).first()
    # if not cart:
    #     cart = Cart(user_id=current_user.id)
    #     db.session.add(cart)
    #     db.session.commit()
    # OR
    if current_user.is_authenticated:
        # If the user is logged in, use the database to manage the cart
        cart = Cart.query.filter_by(user_id=current_user.id).first()
        if not cart:
            cart = Cart(user_id=current_user.id)
            db.session.add(cart)
            db.session.commit()    

    # # Add product to cart (or update quantity if already in cart)
    # cart_item = CartItem.query.filter_by(cart_id=cart.id, product_id=product.id).first()
    # if cart_item:
    #     cart_item.quantity += quantity
    # else:
    #     cart_item = CartItem(cart_id=cart.id, product_id=product.id, quantity=quantity)
    #     db.session.add(cart_item)

    # db.session.commit()

    # return jsonify({"message": "Product added to cart", "cart": cart_items}), 201
    # OR
    # Add product to cart (or update quantity if already in cart)
        cart_item = CartItem.query.filter_by(cart_id=cart.id, product_id=product.id).first()
        if cart_item:
            cart_item.quantity += quantity
        else:
            cart_item = CartItem(cart_id=cart.id, product_id=product.id, quantity=quantity)
            db.session.add(cart_item)

        db.session.commit()

        return jsonify({"message": "Product added to cart"}), 201

    else:
        # For guests, use session storage for cart items
        cart_items = session.get('cart_items', [])
        existing_item = next((item for item in cart_items if item['product_id'] == product_id), None)

        if existing_item:
            existing_item['quantity'] += quantity
        else:
            cart_items.append({
                'product_id': product.id,
                'name': product.name,
                'quantity': quantity,
                'price': product.price
            })

        session['cart_items'] = cart_items

        return jsonify({"message": "Product added to cart"}), 201


# DELETE /cart/:item_id
# a user removes an item from the shopping cart

@cart_routes.route("/cart/<int:item_id>", methods=["DELETE"])
def remove_item_from_cart(item_id):
    # if item_id in cart:
    #     del cart[item_id]
    #     return jsonify({"message": "Item removed from cart", "cart": cart}), 200
    # else:
    #     return jsonify({"message": "Item not found in cart"}), 404
    # OR
    # cart_item = CartItem.query.get_or_404(item_id)
    if current_user.is_authenticated:
        # If the user is logged in, handle cart via the database
        cart_item = CartItem.query.get_or_404(item_id)

    # # Make sure the item belongs to the current user's cart
    # if cart_item.cart.user_id != current_user.id:
    #     return jsonify({"message": "Item not found in your cart"}), 404

    # db.session.delete(cart_item)
    # db.session.commit()

    # return jsonify({"message": "Item removed from cart"}), 200
    # OR
        # Make sure the item belongs to the current user's cart
        if cart_item.cart.user_id != current_user.id:
            return jsonify({"message": "Item not found in your cart"}), 404

        db.session.delete(cart_item)
        db.session.commit()

        return jsonify({"message": "Item removed from cart"}), 200
    else:
        # For guests, remove item from session
        cart_items = session.get('cart_items', [])
        cart_items = [item for item in cart_items if item['product_id'] != item_id]

        session['cart_items'] = cart_items
        return jsonify({"message": "Item removed from cart"}), 200

# POST /checkout
# a user submits the order form

@cart_routes.route("/checkout", methods=["POST"])
@login_required
def checkout():
    form = OrderForm()

    if form.validate_on_submit():
        # Process the order here since the form is valid
        first_name = form.first_name.data
        last_name = form.last_name.data
        street_address = form.street_address.data
        zip_code = form.zip_code.data
        city = form.city.data
        country = form.country.data
        state = form.state.data

    # "if current_user.is_authenticated:" isn't required here because a guest can't submit an order form and only logged in users can submit an order form.
    # if current_user.is_authenticated:
        cart = Cart.query.filter_by(user_id=current_user.id).first()
        if not cart:
            flash("Your cart is empty!", "error")
            return redirect(url_for('cart.cart_page'))

        # Calculate the total price
        total_price = sum(item.product.price * item.quantity for item in cart.items)

        # Create the order
        order = Order(
            user_id=current_user.id,
            total_price=total_price,
            first_name=first_name,
            last_name=last_name,
            street_address=street_address,
            zip_code=zip_code,
            city=city,
            country=country,
            state=state
        )
        db.session.add(order)

        # Move cart items to the order
        for item in cart.items:
            item.order = order

        db.session.commit()

        # Create a transaction
        transaction = Transaction(order_id=order.id, amount=total_price)
        db.session.add(transaction)
        db.session.commit()

        # Clear the cart after checkout
        db.session.delete(cart)
        db.session.commit()

        flash("Order placed successfully!", "success")
        return redirect(url_for('cart.order_confirmation', order_id=order.id))
    else:
            # If form is not valid, render the checkout page again with error messages
            flash("Please fill in all required fields.", "error")
            return render_template('order_form.html', form=form)

# GET /checkout
# displays the cart

@cart_routes.route("/checkout")
@login_required
def checkout_page():
    form = OrderForm()

    # Get the user's cart (whether they are logged in or a guest)
    if current_user.is_authenticated:
        cart = Cart.query.filter_by(user_id=current_user.id).first()
        if not cart:
            flash("Your cart is empty!", "error")
            return redirect(url_for('cart.cart_page'))

        # Calculate the total price
        total_price = sum(item.product.price * item.quantity for item in cart.items)
    else:
        # For guests, use session cart items
        cart_items = session.get('cart_items', [])
        if not cart_items:
            flash("Your cart is empty!", "error")
            return redirect(url_for('cart.cart_page'))

        # Calculate the total price
        total_price = sum(item['price'] * item['quantity'] for item in cart_items)

    return render_template('order_form.html', form=form, total_price=total_price)

# a page for the cart with a checkout button
# TEMPLATE: cart_page.html

# an order form to input information about the user with a payment button
# a purchase form to input payment information of the user
# OR
# a checkout form to input required information about the user and payment information of the user
# TEMPLATE: order_form.html
# a button to go to the order confirmation page
# flash a confirmation message for a successful transaction
# a cancel button to go back to the home page

# a page listing all orders of the user 
# TEMPLATE: order_form_data.html

# a link to go to the list of orders made by the user
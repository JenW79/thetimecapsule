# from ..models import db, environment, SCHEMA, CartItem, Product, User
from ..models import db, environment, SCHEMA, CartItem, User, Product
from sqlalchemy.sql import text

def seed_cart_items():
    nintendo_product = Product.query.filter_by(name='Nintendo').first()
    bratz_product = Product.query.filter_by(name='Bratz').first()
    ipod_product = Product.query.filter_by(name='iPod').first()

    user = User.query.first()

    if nintendo_product and bratz_product and ipod_product and user:
        nintendo_cart_item = CartItem(
            quantity=2,
            product_id=nintendo_product.id,
            user_id=user.id
        )

        bratz_cart_item = CartItem(
            quantity=13,
            product_id=bratz_product.id,
            user_id=user.id
        )

        ipod_cart_item = CartItem(
            quantity=50,
            product_id=ipod_product.id,
            user_id=user.id
        )

        db.session.add(nintendo_cart_item)
        db.session.add(bratz_cart_item)
        db.session.add(ipod_cart_item)
        db.session.commit()

def undo_cart_items():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.cart_items RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM cart_items"))

    db.session.commit()





from ..models import db, environment, SCHEMA, CartItem, User
from sqlalchemy.sql import text

def seed_cart_items():
    nintendo_product = Product.query.filter_by(name='Nintendo').first()
    bratz_product = Product.query.filter_by(name='Bratz').first()
    ipod_product = Product.query.filter_by(name='iPod').first()

    nintendo_product_id = 1
    bratz_product_id = 2
    ipod_product_id = 3

    user = User.query.first()

    if user:
        nintendo_cart_item = CartItem(
            quantity=2,
            product_id=nintendo_product_id,
            user_id=user.id
        )

        bratz_cart_item = CartItem(
            quantity=13,
            product_id=bratz_product_id,
            user_id=user.id
        )

        ipod_cart_item = CartItem(
            quantity=50,
            product_id=ipod_product_id,
            user_id=user.id
        )

        db.session.add(nintendo_cart_item)
        db.session.add(bratz_cart_item)
        db.session.add(ipod_cart_item)
        db.session.commit()

def undo_cart_items():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.cart_items RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM cart_items"))

    db.session.commit()

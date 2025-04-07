from app.models import db, environment, SCHEMA, CartItem, User, Product
from sqlalchemy.sql import text
import logging

logger = logging.getLogger(__name__)

def seed_cart_items():
    nintendo_product = Product.query.filter_by(name='Nintendo Entertainment System (NES)').first()
    bratz_product = Product.query.filter_by(name='Bratz').first()
    ipod_product = Product.query.filter_by(name='iPod').first()

    if not nintendo_product:
        logger.info("Product 'Nintendo Entertainment System (NES)' not found. Creating it.")
        nintendo_product = Product(
            name='Nintendo Entertainment System (NES)', 
            description='Classic 80s gaming console', 
            price=199.99, 
            image_url='url-to-image', 
            decade='1980s', 
            category='Gaming'
        )
        db.session.add(nintendo_product)

    if not bratz_product:
        logger.info("Product 'Bratz' not found. Creating it.")
        bratz_product = Product(
            name='Bratz', 
            description='Doll series', 
            price=19.99, 
            image_url='url-to-image', 
            decade='2000s', 
            category='Toys'
        )
        db.session.add(bratz_product)

    if not ipod_product:
        logger.info("Product 'iPod' not found. Creating it.")
        ipod_product = Product(
            name='iPod', 
            description='Portable media player', 
            price=299.99, 
            image_url='url-to-image', 
            decade='2000s', 
            category='Electronics'
        )
        db.session.add(ipod_product)

    db.session.commit()

    logger.info(f"Found or created products: {nintendo_product}, {bratz_product}, {ipod_product}")

    user = User.query.first()

    if not user:
        logger.error("No user found")
        raise ValueError("User not found!")

    cart_item_1 = CartItem(product_id=nintendo_product.id, user_id=user.id, quantity=1)
    cart_item_2 = CartItem(product_id=bratz_product.id, user_id=user.id, quantity=1)
    cart_item_3 = CartItem(product_id=ipod_product.id, user_id=user.id, quantity=1)

    db.session.add_all([cart_item_1, cart_item_2, cart_item_3])
    db.session.commit()
    logger.info("Cart items added successfully.")

def undo_cart_items():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.cart_items RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM cart_items"))
    db.session.commit()
    logger.info("Cart items removed successfully.")
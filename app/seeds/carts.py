# # from ..models import db, environment, SCHEMA, CartItem, Product, User
# from ..models import db, environment, SCHEMA, CartItem, User, Product
# from sqlalchemy.sql import text
# import logging

# logger = logging.getLogger(__name__)

# def seed_cart_items():
# #     product = Product.query.filter_by(name='Nintendo Entertainment System (NES)').first()
# # if not product:
# #     logger.error("Product 'Nintendo Entertainment System (NES)' not found")
# #     raise ValueError("One or more products not found!")

#     nintendo_product = Product.query.filter_by(name='Nintendo Entertainment System (NES)').first()
#     print(f"Found Nintendo product: {nintendo_product}")
#     bratz_product = Product.query.filter_by(name='Bratz').first()
#     ipod_product = Product.query.filter_by(name='iPod').first()

#     # user = User.query.first()

#     # if nintendo_product and bratz_product and ipod_product and user:
#     # # if nintendo_product and bratz_product and ipod_product:
#     #     # nintendo_cart_item = CartItem(
#     #     #     quantity=2,
#     #     #     product_id=nintendo_product.id,
#     #     #     user_id=user.id
#     #     # )

#     #     # bratz_cart_item = CartItem(
#     #     #     quantity=13,
#     #     #     product_id=bratz_product.id,
#     #     #     user_id=user.id
#     #     # )

#     #     # ipod_cart_item = CartItem(
#     #     #     quantity=50,
#     #     #     product_id=ipod_product.id,
#     #     #     user_id=user.id
#     #     # )
#     if not nintendo_product:
#         logger.error("Product 'Nintendo Entertainment System (NES)' not found")
#         raise ValueError("One or more products not found!")
#     if not bratz_product:
#         logger.error("Product 'Bratz' not found")
#         raise ValueError("One or more products not found!")
#     if not ipod_product:
#         logger.error("Product 'iPod' not found")
#         raise ValueError("One or more products not found!")
#     logger.info(f"Found products: {nintendo_product}, {bratz_product}, {ipod_product}")

#     user = User.query.first()

#     if not user:
#         logger.error("No user found")
#         raise ValueError("User not found!")

#         # nintendo_product_id = nintendo_product.id
#         # bratz_product_id = bratz_product.id
#         # ipod_product_id = ipod_product.id

#         # cart_item_1 = CartItem(product_id=nintendo_product_id, user_id=user.id, quantity=1)
#         # cart_item_2 = CartItem(product_id=bratz_product_id, user_id=user.id, quantity=1)
#         # cart_item_3 = CartItem(product_id=ipod_product_id, user_id=user.id, quantity=1)
#     cart_item_1 = CartItem(product_id=nintendo_product.id, user_id=user.id, quantity=1)
#     cart_item_2 = CartItem(product_id=bratz_product.id, user_id=user.id, quantity=1)
#     cart_item_3 = CartItem(product_id=ipod_product.id, user_id=user.id, quantity=1)

#         # db.session.add(nintendo_cart_item)
#         # db.session.add(bratz_cart_item)
#         # db.session.add(ipod_cart_item)
#     #     db.session.add_all([cart_item_1, cart_item_2, cart_item_3])
#     #     db.session.commit()
#     # else:
#     #     print("One or more products not found!")
#     db.session.add_all([cart_item_1, cart_item_2, cart_item_3])
#     db.session.commit()
#     logger.info("Cart items added successfully.")

#     # if not nintendo_product or not bratz_product or not ipod_product:
#     #     raise ValueError("One or more products not found!")

# def undo_cart_items():
#     if environment == "production":
#         db.session.execute(f"TRUNCATE table {SCHEMA}.cart_items RESTART IDENTITY CASCADE;")
#     else:
#         db.session.execute(text("DELETE FROM cart_items"))

#     db.session.commit()
#     logger.info("Cart items removed successfully.")





# # from ..models import db, environment, SCHEMA, CartItem, User
# # from sqlalchemy.sql import text

# # def seed_cart_items():
# #     nintendo_product = Product.query.filter_by(name='Nintendo').first()
# #     bratz_product = Product.query.filter_by(name='Bratz').first()
# #     ipod_product = Product.query.filter_by(name='iPod').first()

# #     # nintendo_product_id = 1
# #     # bratz_product_id = 2
# #     # ipod_product_id = 3

# #     # user = User.query.first()

# #     if user:
# #         nintendo_cart_item = CartItem(
# #             quantity=1,
# #             product_id=nintendo_product_id,
# #             user_id=user.id
# #         )

# #         bratz_cart_item = CartItem(
# #             quantity=1,
# #             product_id=bratz_product_id,
# #             user_id=user.id
# #         )

# #         ipod_cart_item = CartItem(
# #             quantity=1,
# #             product_id=ipod_product_id,
# #             user_id=user.id
# #         )

# #         db.session.add(nintendo_cart_item)
# #         db.session.add(bratz_cart_item)
# #         db.session.add(ipod_cart_item)
# #         db.session.commit()

# # def undo_cart_items():
# #     if environment == "production":
# #         db.session.execute(f"TRUNCATE table {SCHEMA}.cart_items RESTART IDENTITY CASCADE;")
# #     else:
# #         db.session.execute(text("DELETE FROM cart_items"))

# #     db.session.commit()




from ..models import db, environment, SCHEMA, CartItem, User, Product
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
            price=29.99, 
            image_url='https://example.com/bratz.jpg', 
            decade='2000s', 
            category='Toys'
        )
        db.session.add(bratz_product)

    if not ipod_product:
        logger.info("Product 'iPod' not found. Creating it.")
        ipod_product = Product(
            name='iPod', 
            description='Portable media player', 
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

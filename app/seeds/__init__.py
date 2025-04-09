from flask.cli import AppGroup
from .users import seed_users, undo_users
from .carts import seed_cart_items, undo_cart_items
from .reviews import seed_reviews, undo_reviews
from .products import seed_products, undo_products
from .favorites import seed_favorites, undo_favorites
from app.models import db, environment, SCHEMA, Product, User


# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo 
        # command, which will  truncate all tables prefixed with 
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_users()
        undo_cart_items()
        undo_reviews()
        undo_favorites()
    seed_users()
    # Add other seed functions here
    seed_cart_items()
    seed_reviews()
    seed_products()

    #Fetch the users & products for favorites
    users = User.query.all()
    products = Product.query.all()
    seed_favorites(db.session, users, products)


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_users()
    # Add other undo functions here
    undo_cart_items()
    undo_reviews()
    undo_products()
    undo_favorites()
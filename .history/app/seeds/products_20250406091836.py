from app.models import db, Product, User, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

def seed_products():
    """
    Seed products table with initial data
    
    Returns:
        list: List of created product objects
    """
    logger.info("Seeding products...")
    
    # Get user IDs for assigning products
    demo = User.query.filter(User.username == 'Demo').first()
    marnie = User.query.filter(User.username == 'marnie').first()
    bobbie = User.query.filter(User.username == 'bobbie').first()
    
    # Default to demo user if needed
    owner_id = demo.id if demo else 1
    
    products = [
        # 80s Products
        Product(
            name="Cabbage Patch Kids",
            description="Popular soft-bodied dolls with adoption papers, a cultural phenomenon of the 1980s",
            price=49.99,
            image_url="https://example.com/cabbage-patch-kids.jpg",
            decade="80s",
            category="toy",
            owner_id=owner_id,
            created_at=datetime.now()
        ),
        Product(
            name="Pac-Man",
            description="Iconic arcade game where players navigate a yellow character through a maze eating dots and avoiding ghosts",
            price=29.99,
            image_url="https://example.com/pacman.jpg",
            decade="80s",
            category="game",
            owner_id=owner_id,
            created_at=datetime.now()
        ),
        Product(
            name="Nintendo Entertainment System (NES)",
            description="8-bit home video game console that revitalized the video game industry in the 1980s",
            price=199.99,
            image_url="https://example.com/nes.jpg",
            decade="80s",
            category="electronic",
            owner_id=owner_id,
            created_at=datetime.now()
        ),

        # 90s Products
        Product(
            name="Beanie Babies",
            description="Small stuffed animals filled with plastic pellets, creating a collecting craze in the 1990s",
            price=9.99,
            image_url="https://example.com/beanie-babies.jpg",
            decade="90s",
            category="toy",
            owner_id=marnie.id if marnie else owner_id,
            created_at=datetime.now()
        ),
        Product(
            name="Pokemon",
            description="Japanese media franchise centered on fictional creatures called Pokemon, with games, trading cards, and more",
            price=39.99,
            image_url="https://example.com/pokemon.jpg",
            decade="90s",
            category="game",
            owner_id=marnie.id if marnie else owner_id,
            created_at=datetime.now()
        ),
        Product(
            name="Cassettes",
            description="Analog magnetic tape recording format for audio recording and playback, popular in the 1990s",
            price=14.99,
            image_url="https://example.com/cassettes.jpg",
            decade="90s",
            category="electronic",
            owner_id=marnie.id if marnie else owner_id,
            created_at=datetime.now()
        ),

        # 00s Products
        Product(
            name="Bratz",
            description="Fashion dolls characterized by their large heads and stylized features, popular in the 2000s",
            price=24.99,
            image_url="https://example.com/bratz.jpg",
            decade="00s",
            category="toy",
            owner_id=bobbie.id if bobbie else owner_id,
            created_at=datetime.now()
        ),
        Product(
            name="Call of Duty",
            description="First-person shooter video game franchise that began in 2003, known for its realistic warfare gameplay",
            price=59.99,
            image_url="https://example.com/call-of-duty.jpg",
            decade="00s",
            category="game",
            owner_id=bobbie.id if bobbie else owner_id,
            created_at=datetime.now()
        ),
        Product(
            name="iPod",
            description="Portable media player designed and marketed by Apple Inc., revolutionary in the 2000s music scene",
            price=299.99,
            image_url="https://example.com/ipod.jpg",
            decade="00s",
            category="electronic",
            owner_id=bobbie.id if bobbie else owner_id,
            created_at=datetime.now()
        )
    ]
    
    db.session.add_all(products)
    db.session.commit()
    
    logger.info(f"Created {len(products)} products")
    return products

# Uses a raw SQL query to TRUNCATE or DELETE the products table.
def undo_products():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.products RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM products"))
    
    db.session.commit()
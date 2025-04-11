import logging
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.models import Favorite, User, Product, db, environment, SCHEMA

logger = logging.getLogger(__name__)

def seed_favorites(db: Session, users: list[User], products: list[Product]):
    """
    Seed favorites table with initial data
    
    Args:
        db (Session): SQLAlchemy database session
        users (list): List of user objects
        products (list): List of product objects
        
    Returns:
        list: List of created favorite objects
    """
    logger.info("Seeding favorites...")
    
    favorites = [
        # User 1 likes 80s toys, 90s games, and 00s electronics
        Favorite(
            user_id=users[0].id,
            product_id=products[0].id  # Cabbage Patch Kids
        ),
        Favorite(
            user_id=users[0].id,
            product_id=products[4].id  # Pokemon
        ),
        Favorite(
            user_id=users[0].id,
            product_id=products[8].id  # iPod
        ),
        
        # User 2 likes games from all decades
        Favorite(
            user_id=users[1].id,
            product_id=products[1].id  # Pac-Man
        ),
        Favorite(
            user_id=users[1].id,
            product_id=products[4].id  # Pokemon
        ),
        Favorite(
            user_id=users[1].id,
            product_id=products[7].id  # Call of Duty
        ),
        
        # User 3 likes electronics from all decades
        Favorite(
            user_id=users[2].id,
            product_id=products[2].id  # NES
        ),
        Favorite(
            user_id=users[2].id,
            product_id=products[5].id  # Cassettes
        ),
        Favorite(
            user_id=users[2].id,
            product_id=products[8].id  # iPod
        )
    ]
    
    db.add_all(favorites)
    db.commit()
    
    # Refresh favorites to get their IDs
    for favorite in favorites:
        db.refresh(favorite)
    
    logger.info(f"Created {len(favorites)} favorites")
    return favorites


def undo_favorites():
    try:
        if environment == "production":
            db.session.execute(
                text(f"TRUNCATE table {SCHEMA}.favorites RESTART IDENTITY CASCADE;")
            )
        else:
            db.session.execute(text("DELETE FROM favorites"))
        db.session.commit()
    except Exception as e:
        print("Skipping undo_favorites due to error:", e)
        db.session.rollback()
    
    

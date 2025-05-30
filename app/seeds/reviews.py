from app.models import db, Review
from datetime import datetime, timezone

def seed_reviews():
    r1 = Review(user_id=1, product_id=1, rating=5, review_text="Absolutely love this!", created_at=datetime.now(timezone.utc))
    r2 = Review(user_id=2, product_id=1, rating=4, review_text="Pretty good, shipping was fast", created_at=datetime.now(timezone.utc))
    r3 = Review(user_id=3, product_id=2, rating=3, review_text="It's okay, not my favorite", created_at=datetime.now(timezone.utc))
    r4 = Review(user_id=1, product_id=9, rating=4, review_text="Vintage vibes, still works great!", created_at=datetime.now(timezone.utc))

    db.session.add_all([r1, r2, r3, r4])
    db.session.commit()

def undo_reviews():
    try:
        db.session.execute('DELETE FROM reviews')
        db.session.commit()
    except Exception as e:
        print("Skipping DELETE FROM reviews:", e)
        db.session.rollback() 
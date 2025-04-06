from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy import DateTime, ForeignKey
from datetime import datetime
from sqlalchemy.orm import relationship

# class Decade(enum.Enum):
#     EIGHTIES = "80s"
#     NINETIES = "90s"
#     TWO_THOUSANDS = "00s"

# class Category(enum.Enum):
#     TOY = "toy"
#     GAME = "game"
#     ELECTRONIC = "electronic"

class Product(db.Model):
    __tablename__ = "products"
    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True, index=True)
    name = db.Column(db.String, index=True)
    description = db.Column(db.Text)
    price = db.Column(db.Float)
    image_url = db.Column(db.String)
    decade = db.Column(db.String, nullable=False)
    category = db.Column(db.String, nullable=False)
    owner_id = db.Column(db.Integer, ForeignKey("users.id"))
    created_at = db.Column(DateTime, default=datetime.now())

    # Relationships
    owner = db.relationship("User", back_populates="products")
    # favorited_by = relationship("Favorite", back_populates="product") // to be added later (commented out due to throwing errors)
    reviews = db.relationship("Review", back_populates="product")
    cart_items = db.relationship("CartItem", back_populates="product")
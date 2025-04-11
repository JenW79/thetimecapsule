from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy import DateTime, ForeignKey
from datetime import datetime
from sqlalchemy.orm import relationship
from app.models.cart_item import CartItem
from .db import add_prefix_for_prod

# class Decade(enum.Enum):
#     EIGHTIES = "80s"
#     NINETIES = "90s"
#     TWO_THOUSANDS = "00s"

# class Category(enum.Enum):
#     TOY = "toy"
#     GAME = "game"
#     ELECTRONIC = "electronic"
# 

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
    owner_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")))
    created_at = db.Column(DateTime, default=datetime.now)

    

    # Relationships
    owner = db.relationship("User", back_populates="products")
    favorited_by = db.relationship("Favorite", back_populates="product", cascade="all, delete-orphan")
    reviews = db.relationship("Review", back_populates="product")
    cart_items = db.relationship("CartItem", back_populates="product")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "price": round(self.price, 2),
            "image_url": self.image_url,
            "decade": self.decade,
            "category": self.category,
            "owner": {
                "id": self.owner.id,
                "username": self.owner.username
            } if self.owner else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "review_count": len(self.reviews)
        }

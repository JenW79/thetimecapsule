from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy import DateTime
from datetime import datetime

class CartItem(db.Model):
    __tablename__ = 'cart_items'
    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')))
    product_id = db.Column(db.Integer,db.ForeignKey(add_prefix_for_prod('products.id')), nullable=False)
    quantity = db.Column(db.Integer)
    created_at = db.Column(DateTime, default=datetime.now())
    updated_at = db.Column(DateTime, default=datetime.now(), onupdate=datetime.utcnow)
    is_ordered = db.Column(db.Boolean, default=False)

    user = db.relationship('User', backref='cart_items')
    product = db.relationship('Product', back_populates='cart_items')

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "product_id": self.product_id,
            "quantity": self.quantity,
            'price': self.product.price if hasattr(self, 'product') and self.product else 0,
            'name': self.product.name if hasattr(self, 'product') and self.product else 'Unknown Product',
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "is_ordered": self.is_ordered
        }

    def __repr__(self):
            return f"<CartItem {self.id} - {self.product.name}>"
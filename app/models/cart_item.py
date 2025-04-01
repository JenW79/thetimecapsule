from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class CartItem(db.Model):
    __tablename__ = 'cart_items'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'))
    quantity = db.Column(db.Integer)
    price = db.Column(db.Numeric, nullable=False)
    created_at = db.Column(db.DateTime)
    updated_at = db.Column(db.DateTime)

    user = db.relationship('User', backref='cart_items')
    product = db.relationship('Product', backref='cart_items')
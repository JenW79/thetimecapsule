from flask_sqlalchemy import SQLAlchemy
from enum import Enum
from sqlalchemy import Enum as SQLEnum, Integer, String, DateTime
from datetime import datetime
# from sqlalchemy.types import Decimal
from sqlalchemy.types import Numeric

db = SQLAlchemy()

class OrderStatus(Enum):
    PENDING = 'pending'
    COMPLETED = 'completed'
    SHIPPED = 'shipped'
    CANCELLED = 'cancelled'

class PaymentStatus(Enum):
    PAID = 'paid'
    UNPAID = 'unpaid'
    PENDING = 'pending'

class CartStatus(Enum):
    ACTIVE = 'active'
    ABANDONED = 'abandoned'
    PURCHASED = 'purchased'

class CartItem(db.Model):
    __tablename__ = 'cart_items'

    id = db.Column(db.Integer, primary_key=True)
    cart_id = db.Column(db.Integer, db.ForeignKey('carts.id'))
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'))
    quantity = db.Column(db.Integer)
    # price = db.Column(db.Decimal)
    price = db.Column(Numeric, nullable=False)
    created_at = db.Column(db.DateTime)
    updated_at = db.Column(db.DateTime)

class Cart(db.Model):
    __tablename__ = 'carts'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime)
    updated_at = db.Column(db.DateTime)
    status = db.Column(SQLEnum(CartStatus), nullable=False)

class Transaction(db.Model):
    __tablename__ = 'transactions'

    transaction_id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'))
    # amount = db.Column(db.Decimal)
    amount = db.Column(Numeric, nullable=False)
    status = db.Column(db.String)
    payment_method = db.Column(db.String)
    transaction_date = db.Column(db.DateTime)

class Order(db.Model):
    __tablename__ = 'orders'

    id = db.Column(db.Integer, primary_key=True) 
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    # total_price = db.Column(db.Decimal)
    total_price = db.Column(Numeric, nullable=False)
    status = db.Column(SQLEnum(OrderStatus), nullable=False)
    payment_status = db.Column(SQLEnum(PaymentStatus), nullable=False)
    shipping_address = db.Column(db.String)
    created_at = db.Column(db.DateTime)
    updated_at = db.Column(db.DateTime)
    shipped_at = db.Column(db.DateTime, nullable=True)
    completed_at = db.Column(db.DateTime, nullable=True)



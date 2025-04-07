from flask_wtf import FlaskForm
from wtforms import StringField, SelectField, IntegerField, SubmitField
# from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired
from flask_sqlalchemy import SQLAlchemy
# db = SQLAlchemy()
from .. import db

class OrderForm(FlaskForm):
    first_name = StringField("First Name", validators=[
        DataRequired(message="First name is required"),
        Length(min=2, max=50, message="First name must be between 2 and 50 characters")
    ])
    
    last_name = StringField("Last Name", validators=[
        DataRequired(message="Last name is required"),
        Length(min=2, max=50, message="Last name must be between 2 and 50 characters")
    ])
    
    street_address = StringField("Street Address", validators=[
        DataRequired(message="Street address is required"),
        Length(min=5, max=100, message="Street address must be between 5 and 100 characters")
    ])
    
    zip_code = IntegerField("Zip Code", validators=[
        DataRequired(message="Zip code is required")
    ])
    
    city = StringField("City", validators=[
        DataRequired(message="City is required"),
        Length(min=2, max=50, message="City must be between 2 and 50 characters")
    ])
    
    state = StringField("State", validators=[
        DataRequired(message="State is required"),
        Length(min=2, max=50, message="State must be between 2 and 50 characters")
    ])
    
    country = StringField("Country", validators=[
        DataRequired(message="Country is required"),
        Length(min=2, max=50, message="Country must be between 2 and 50 characters")
    ])
    
    payment_method = SelectField("Payment Method", validators=[
        DataRequired(message="Payment method is required")
    ], choices=[
        ('Credit Card', 'Credit Card'),
        ('Debit Card', 'Debit Card'),
        ('PayPal', 'PayPal'),
        ('Apple Pay', 'Apple Pay'),
        ('Google Pay', 'Google Pay'),
        ('Amazon Pay', 'Amazon Pay'),
        ('Samsung Pay', 'Samsung Pay'),
        ('Venmo', 'Venmo'),
        ('Stripe', 'Stripe'),
        ('Affirm', 'Affirm'),
        ('Klarna', 'Klarna'),
        ('Zip', 'Zip'),
        ('Sezzle', 'Sezzle'),
        ('Afterpay', 'Afterpay'),
            ])
    expiration_date = StringField("Expiration Date")
    cvv = StringField("CVV")
    card_number = StringField("Card Number")

    submit = SubmitField("Submit")
    cancel = SubmitField("Cancel")
    
    def validate_card_number(self, field):
        if self.payment_method.data in ['Credit Card', 'Debit Card'] and not field.data:
            raise ValidationError("Card number is required for credit/debit card payments")
        
        if field.data and not field.data.isdigit():
            raise ValidationError("Card number must contain only digits")
    
    def validate_expiration_date(self, field):
        if self.payment_method.data in ['Credit Card', 'Debit Card'] and not field.data:
            raise ValidationError("Expiration date is required for credit/debit card payments")
    
    def validate_cvv(self, field):
        if self.payment_method.data in ['Credit Card', 'Debit Card'] and not field.data:
            raise ValidationError("CVV is required for credit/debit card payments")
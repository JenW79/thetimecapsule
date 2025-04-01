from flask_wtf import FlaskForm
from wtforms import StringField, SelectField, IntegerField, SubmitField
# from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired
from flask_sqlalchemy import SQLAlchemy
# db = SQLAlchemy()
from app import db

class OrderForm(FlaskForm):
    first_name = StringField("First Name", validators=[DataRequired()])
    last_name = StringField("Last Name", validators=[DataRequired()])
    street_address = StringField("Street Address", validators=[DataRequired()])
    zip_code = IntegerField("Zip Code", validators=[DataRequired()])
    city =  StringField("City", validators=[DataRequired()])
    country = StringField("Country", validators=[DataRequired()])
    state = StringField("State", validators=[DataRequired()])
    payment_method = SelectField("Payment Method", choices=[
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
    submit = SubmitField("Submit")
    cancel = SubmitField("Cancel")
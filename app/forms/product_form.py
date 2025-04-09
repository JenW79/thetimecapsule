from flask_wtf import FlaskForm
from wtforms import StringField, DecimalField, TextAreaField
from wtforms.validators import DataRequired

class ProductForm(FlaskForm):
    
    name = StringField('Name', validators=[DataRequired()])
    description = TextAreaField('Description')
    price = DecimalField('Price', validators=[DataRequired()])
    image_url = StringField('Image URL')
    decade = StringField('Decade', validators=[DataRequired()])
    category = StringField('Category', validators=[DataRequired()])
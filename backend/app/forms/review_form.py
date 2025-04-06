from flask_wtf import FlaskForm
from wtforms import IntegerField, TextAreaField
from wtforms.validators import DataRequired, NumberRange, Optional


class ReviewForm(FlaskForm):

    rating = IntegerField(
        'Rating',
        validators=[
            DataRequired(message="Rating is required."),
            NumberRange(min=1, max=5, message="Rating must be between 1 and 5.")
        ]
    )
    review_text =TextAreaField('Review', validators=[Optional()])
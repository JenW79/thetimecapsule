from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import db, Review
from app.forms.review_form import ReviewForm

review_routes = Blueprint('reviews', __name__)

#GET all reviews for a specific product /api/product<id>/reviews
@review_routes.route('/products/<int:product_id>/reviews')
def get_reviews(product_id):
    reviews = Review.query.filter(Review.product_id == product_id).all()
    return {"reviews": [review.to_dict() for review in reviews]}

# POST a new review /api/products/<id>/reviews
@review_routes.route('/products/<int:product_id>/reviews', methods=['POST'])
@login_required
def create_review(product_id):
    form = ReviewForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        new_review = Review(
            user_id=current_user.id,
            product_id=product_id,
            rating=form.data['rating'],
            review_text=form.data['review_text']
        )
        db.session.add(new_review)
        db.session.commit()
        return new_review.to_dict()
    return {"errors": form.errors}, 400

# PUT update a review /api/reviews/<id>
@review_routes.route('/reviews/<int:id>', methods=['PUT'])
@login_required
def update_review(id):
    review = Review.query.get(id)
    if not review:
        return {"error": "Review not found"}, 404
    if review.user_id != current_user.id:
        return {"error": "Unauthorized"}, 403

    form = ReviewForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        review.rating = form.data['rating']
        review.review_text = form.data['review_text']
        db.session.commit()
        return review.to_dict()
    return {"errors": form.errors}, 400

#DELETE a review /api/reviews/review<id>
@review_routes.route('/reviews/<int:id>', methods=['DELETE'])
@login_required
def delete_review(id):
    review = Review.query.get(id)
    if not review:
        return{"error": "Review not found"}, 404
    if review.user_id != current_user.id:
        return{'error': "Review not available"}, 403
    
    db.session.delete(review)
    db.session.commit()
    return{"message": "Review has been deleted"}

#GET all reviews for current user /api/reviews/current
@review_routes.route('/reviews/current')
@login_required
def user_reviews():
    reviews = Review.query.filter_by(user_id=current_user.id).all()
    return {"reviews": [review.to_dict() for review in reviews]}
from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, Favorite, Product
import json

favorites_routes = Blueprint('favorites', __name__)

#GET /api/favorites
@favorites_routes.route('')
@login_required
def get_favorites():
    favorites = Favorite.query.filter_by(user_id=current_user.id).all()
    return jsonify([{
        'id': fav.id,
        'product': {
            'id': fav.product.id,
            'name': fav.product.name,
            'price': fav.product.price,
            'image_url': (
                json.loads(fav.product.image_url)[0]
                if fav.product.image_url and fav.product.image_url.startswith("[")
                else fav.product.image_url
            ),
            'images': (
                json.loads(fav.product.image_url)
                if fav.product.image_url and fav.product.image_url.startswith("[")
                else [fav.product.image_url]
            )
        }
    } for fav in favorites])

#POST /api/favorites
@favorites_routes.route('', methods=['POST'])
@login_required
def add_favorite():
    data = request.get_json()
    product_id = data.get('product_id')
    try:
        product_id = int(product_id)
        if product_id <= 0:
            raise ValueError
    except (ValueError, TypeError):
        return jsonify({'error': 'Invalid product ID'}), 400

    #check if already favorited
    existing = Favorite.query.filter_by(user_id=current_user.id, product_id=product_id).first()
    if existing:
        return jsonify({"error": "Product already favorited"}), 400

    favorite = Favorite(user_id=current_user.id, product_id=product_id)
    db.session.add(favorite)
    db.session.commit()

    return jsonify({
        'id': favorite.id,
        'product': {
            'id': favorite.product.id,
            'name': favorite.product.name,
            'price': favorite.product.price
        }
    }), 201

#DELETE /api/favorites/:id
@favorites_routes.route('/<int:id>', methods=["DELETE"])
@login_required
def remove_favorite(id):
    try:
        id = int(id)
        if id <= 0:
            raise ValueError
    except (ValueError, TypeError):
        return jsonify({'error': 'Invalid favorite ID'}), 400

    favorite = Favorite.query.get(id)
    if not favorite or favorite.user_id != current_user.id:
        return jsonify({'error': "Unauthorized"}), 403

    db.session.delete(favorite)
    db.session.commit()
    return jsonify({'message': "Removed from favorites"})
from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, Favorite, Product
from datetime import datetime

favorites_routes= Blueprint('favorites', __name__)

#GET /api/favorites
@favorites_routes.route('')
@login_required
def get_favorites():
    favorites = Favorite.query.filter_by(user_id = current_user.id).all()
    return jsonify([{
         'id': fav.id,
        'product': {
            'id': fav.product.id,
            'name': fav.product.name,
            'price': fav.product.price
        }
    } for fav in favorites])

#POST /api/favorites
@favorites_routes.route('/', methods=['POST'])
@login_required
def add_favorite():
    data = request.get_json()
    product_id = data.get('product_id')

    #check if already favorited
    existing = Favorite.query.filter_by(user_id = current_user.id, product_id=product_id).first()
    if existing:
        return jsonify({"error": "Product already favorited"}), 400
    favorite = Favorite(user_id = current_user.id, product_id=product_id)
    db.session.add(favorite)
    db.session.commit()

    return jsonify({'id': favorite.id, 'product_id': favorite.product_id}), 201

#DELETE /api/favorites/:id
@favorites_routes.route('/<int:id>', methods=["DELETE"])
@login_required
def remove_favorite(id):
    favorite = Favorite.query.get(id)
    if not favorite or favorite.user_id != current_user.id:
        return jsonify({'error': "Unauthorized"}), 403
    db.session.delete(favorite)
    db.session.commit()
    return jsonify({'message': "Remove from favorite"})


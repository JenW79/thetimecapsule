from flask import Blueprint, request, jsonify 
from flask_login import login_required, current_user
from app.models import db, Product
from app.forms import ProductForm

product_routes = Blueprint('products', __name__)

#GET products /api/products
@product_routes.route('')
def get_products():
    decade = request.args.get('decade')
    category = request.args.get('category')

    query = Product.query
    if decade:
        query = query.filter(Product.decade == decade)
    if category:
        query = query.filter(Product.category == category)

    products = query.all()

    return jsonify([product.to_dict() for product in products])

#POST new product /api/products
@product_routes.route('/', methods=['POST'])
@login_required
def create_product():
    form = ProductForm()
    if form.validate_on_submit():
        new_product = Product(
            name=form.name.data,
            description=form.description.data,
            price=form.price.data,
            image_url=form.image_url.data,
            decade=form.decade.data,
            category=form.category.data,
            owner_id=current_user.id
        )
        db.session.add(new_product)
        db.session.commit()
        return new_product.to_dict(), 201
    return {"errors": form.errors}, 400

#PUT edit a product /api/products/<id>
@product_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_product(id):
    product = Product.query.get(id)
    if not product or product.owner_id != current_user.id:
        return {"error": "Unauthorized or not found"}, 403

    data = request.get_json()
    for field in ['name', 'description', 'price', 'image_url']:
        if field in data:
            setattr(product, field, data[field])
    db.session.commit()
    return product.to_dict()

#DELETE a product /api/products/<id>
@product_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_product(id):
    product = Product.query.get(id)
    if not product or product.owner_id != current_user.id:
        return {"error": "Unauthorized or not found"}, 403

    db.session.delete(product)
    db.session.commit()
    return {"message": "Product deleted"}

#GET all products owned by a user /api/products/current
@product_routes.route('/current', methods=['GET'])
@login_required
def get_user_products():
    user_products = Product.query.filter_by(owner_id=current_user.id).all()
    return jsonify([product.to_dict() for product in user_products])
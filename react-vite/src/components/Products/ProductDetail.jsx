import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProduct } from "../../redux/products";
import { addToCart } from "../../redux/cart";
import FavoriteButton from "../Favorites/FavoriteButton";
import CreateReviewModal from "../Reviews/CreateReviewModal";
import "./Products.css";
import "../Reviews/Reviews.css";
import "../Favorites/Favorites.css";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const parsedId = parseInt(id, 10);

  // Check both ways of accessing the product from the store
  const productFromIndex = useSelector((state) => state.products[parsedId]);
  const productsObject = useSelector((state) => state.products);

  const productFromArray = useMemo(() => {
    return Object.values(productsObject).find((p) => p.id === parsedId);
  }, [productsObject, parsedId]);

  // Use whichever is available
  const product = productFromIndex || productFromArray;

  const isOwner = sessionUser?.id === product?.owner?.id;
  const [showReviewModal, setShowReviewModal] = useState(false);

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart(product));
    }
  };

  useEffect(() => {
    dispatch(fetchProduct(parsedId));
  }, [dispatch, parsedId]);

  if (isNaN(parsedId)) return <div className="error-message">Invalid product ID.</div>;
  if (!product) return <div className="product-not-found">Loading product...</div>;

  const productImages = product?.images?.length > 0
    ? product.images
    : product?.image_url
    ? [product.image_url]
    : ['/assets/placeholder.png'];

  return (
    <div className="product-detail-page">
      <div className="product-item product-detail">
        <div className="product-info-wrapper">
          <h1 className="product-title">{product?.name || "Product Title"}</h1>
          <p className="product-description">{product?.description || "Description"}</p>
          <p className="product-price">${product?.price?.toFixed(2) || "0.00"}</p>

          {product.average_rating && (
            <p className="product-rating">
              ⭐ <span className="rating-text">{product.average_rating.toFixed(1)} / 5</span>
            </p>
          )}

          <div className="product-actions">
            {isOwner ? (
              <div className="product-owner-actions">
                <button className="edit-button">Edit</button>
                <button className="delete-button">Delete</button>
              </div>
            ) : (
              <>
                <FavoriteButton productId={product.id} />
                <button className="add-to-cart-button" onClick={handleAddToCart}>
                  Add to Cart
                </button>
              </>
            )}
          </div>
        </div>

        <div className="product-images-grid grid-4">
          {productImages.map((imageUrl, index) => (
            <div key={index} className="product-image-wrapper">
              <img src={imageUrl} alt={`${product.name} view ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>

      <div className="reviews-section">
        <h1 className="reviews-title">Reviews</h1>
        {product.reviews?.length > 0 ? (
          <div className="review-list">
            {product.reviews.map((review) => (
              <div key={review.id} className="review-item">
                <div className="review-stars">
                  {Array(review.rating).fill().map((_, i) => (
                    <span key={i} className="star">★</span>
                  ))}
                </div>
                <div className="review-user">{review.user?.username || "user"}</div>
                <div className="review-date">{review.created_at || "date"}</div>
                <div className="review-description">{review.comment || "description"}</div>
              </div>
            ))}
          </div>
        ) : (
          <p>No reviews yet. Be the first to review this product!</p>
        )}

        <button className="leave-review-button" onClick={() => setShowReviewModal(true)}>
          leave a review
        </button>

        {showReviewModal && (
          <CreateReviewModal
            productId={product.id}
            onClose={() => {
              setShowReviewModal(false);
              dispatch(fetchProduct(product.id));
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
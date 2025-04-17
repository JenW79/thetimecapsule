import { useEffect, useState } from "react";
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


  // Check both ways of accessing the product from the store
  const productFromIndex = useSelector((state) => state.products[parseInt(id)]);
  const productsArray = useSelector((state) => Object.values(state.products));
  const productFromArray = productsArray.find((p) => p.id === parseInt(id));

  // Use whichever is available
  const product = productFromIndex || productFromArray;
  const isOwner = sessionUser?.id === product?.owner?.id;
  const [showReviewModal, setShowReviewModal] = useState(false);

 

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  useEffect(() => {
    const loadProduct = async () => {
      try {
        await dispatch(fetchProduct(id));
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    loadProduct();
  }, [dispatch, id]);

  if (!product) {
    return <div className="product-not-found">Loading product...</div>;
  }
  
  // Parse and determine product images
  const productImages = (() => {
    if (
      product.images &&
      Array.isArray(product.images) &&
      product.images.length > 0
    ) {
      return product.images;
    }

    if (typeof product.image_url === "string") {
      try {
        let cleanedString = product.image_url.replace(/^"|"$/g, "");

        if (cleanedString.trim().startsWith("[")) {
          const parsedImages = JSON.parse(cleanedString);
          return Array.isArray(parsedImages)
            ? parsedImages
            : [product.image_url];
        }
      } catch (e) {
        console.error("Failed to parse image_url as JSON:", e);
      }

      if (product.image_url.includes(",")) {
        return product.image_url.split(",").map((url) => url.trim());
      }

      return [product.image_url];
    }

    return ["/assets/placeholder.png"];
  })();



  return (
    <div className="product-detail-page">
      <div className="product-item product-detail">
        <div className="product-info-wrapper">
          <h1 className="product-title">{product?.name || "Product Title"}</h1>
          <p className="product-description">
            {product?.description || "Description"}
          </p>
          <p className="product-price">
            ${product?.price?.toFixed(2) || "0.00"}
          </p>

          {/* added average rating */}
          
          {product.average_rating && (
            <p className="product-rating">
              ⭐ {product.average_rating.toFixed(1)} / 5
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
                <button
                  className="add-to-cart-button"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
              </>
            )}
          </div>
        </div>

        <div className="product-images-grid grid-4">
          {productImages.length > 0 ? (
            productImages.slice(0, 4).map((imageUrl, index) => (
              <div key={index} className="product-image-wrapper">
                <img src={imageUrl} alt={`${product.name} view ${index + 1}`} />
              </div>
            ))
          ) : (
            <div className="product-image-wrapper">
              <img src="/assets/placeholder.png" alt={product.name} />
            </div>
          )}
        </div>
      </div>

      <div className="reviews-section">
        <h2 className="reviews-title">Reviews</h2>
        {product.reviews && product.reviews.length > 0 ? (
          <div className="review-list">
            {product.reviews.map((review) => (
              <div key={review.id} className="review-item">
                <div className="review-stars">
                  {Array(review.rating)
                    .fill()
                    .map((_, i) => (
                      <span key={i} className="star">
                        ★
                      </span>
                    ))}
                </div>
                <div className="review-user">
                  {review.user?.username || "user"}
                </div>
                <div className="review-date">{review.created_at || "date"}</div>
                <div className="review-description">
                  {review.comment || "description"}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No reviews yet. Be the first to review this product!</p>
        )}
        <button
          className="leave-review-button"
          onClick={() => setShowReviewModal(true)}
        >
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

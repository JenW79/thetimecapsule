import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { editProduct } from "../../redux/products";
import { addToCart } from "../../redux/cart";
import EditProductForm from "./EditProductForm";
import DeleteProduct from "./DeleteProduct";
import FavoriteButton from "../Favorites/FavoriteButton";
import CreateReviewModal from "../Reviews/CreateReviewModal";
import { fetchProduct } from "../../redux/products";
import "./Products.css";

const ProductItem = ({ product, customThumbnailClass }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [productImages, setProductImages] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  const handleProductUpdate = async (updatedData) => {
    await dispatch(editProduct(product.id, updatedData));
    setIsEditing(false);
  };

  const isDetailPage = window.location.pathname.includes(
    `/product/${product.id}`
  );

  useEffect(() => {
    const parseImages = () => {
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
    };

    const images = parseImages();
    setProductImages(images);
  }, [product]);

  const getImageByIndex = (index) => {
    if (index < productImages.length) {
      return productImages[index];
    }
    return productImages[0] || "/assets/placeholder.png";
  };

  return (
    <div className={isDetailPage ? "product-detail" : "product-item"}>
      {isEditing ? (
        <EditProductForm
          product={product}
          onProductUpdated={handleProductUpdate}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <>
          {isDetailPage ? (
            <div className="product-container">
              <div className="product-info">
                <h1 className="product-title">{product.name}</h1>
                <p className="product-description">{product.description}</p>
                <p className="product-price">${product.price.toFixed(2)}</p>
                <button
                  className="add-to-cart-button"
                  onClick={handleAddToCart}
                >
                  add to cart
                </button>
              </div>
              {product.reviews && product.reviews.length > 0 && (
                <div className="product-reviews">
                  <h4>Reviews:</h4>
                  <ul>
                    {product.reviews.map((review) => (
                      <li key={review.id}>
                        <strong>{review.user.username}</strong>:{" "}
                        {review.comment} ⭐{review.rating}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <button
                className="leave-review-button"
                onClick={() => setShowReviewModal(true)}
              >
                Leave a Review
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
              <div className="product-gallery">
                {[0, 1, 2, 3].map((index) => (
                  <div key={index} className="gallery-image">
                    <img
                      src={getImageByIndex(index)}
                      alt={`${product.name} view ${index + 1}`}
                    />
                  </div>
                ))}
                <div className="pattern-image">
                  <img
                    src="/assets/sprinkle-green.png"
                    alt="Decorative pattern"
                  />
                </div>
              </div>
            </div>
          ) : (
            <>
              {customThumbnailClass ? (
                <div className={customThumbnailClass}>
                  <img src={getImageByIndex(0)} alt={product.name} />
                </div>
              ) : (
                <div className="product-thumbnail">
                  <img src={getImageByIndex(0)} alt={product.name} />
                </div>
              )}
              <h3>{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <p className="product-price">${product.price.toFixed(2)}</p>

              <div className="product-actions">
                <button
                  className="edit-button"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
                <DeleteProduct productId={product.id} />
                <FavoriteButton productId={product.id} />
                <button
                  className="add-to-cart-button"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ProductItem;

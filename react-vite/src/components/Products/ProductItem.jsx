import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom"; // Import Link for navigation
import { editProduct } from "../../redux/products";
import { addToCart } from "../../redux/cart";
import EditProductForm from "./EditProductForm";
import DeleteProduct from "./DeleteProduct";
import FavoriteButton from "../Favorites/FavoriteButton";
import CreateReviewModal from "../Reviews/CreateReviewModal";
import { fetchProduct } from "../../redux/products";
import "./Products.css";
import "../Favorites/Favorites.css";

const ProductItem = ({ product}) => {
  const dispatch = useDispatch();
  //preventing non-owners from editing/deleting products
  const sessionUser = useSelector((state) => state.session.user);
  const isOwner = sessionUser?.id === product?.owner?.id;
  //preventing non-owners from editing/deleting products
  const [isEditing, setIsEditing] = useState(false);
  const [productImages, setProductImages] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
    setCurrentImageIndex(0); // Reset the index when product changes
  }, [product]);

  const getImageByIndex = (index) => {
    if (index < productImages.length) {
      return productImages[index];
    }
    return productImages[0] || "/assets/placeholder.png";
  };

  // const nextImage = () => {
  //   setCurrentImageIndex((prevIndex) =>
  //     prevIndex + 1 >= productImages.length ? 0 : prevIndex + 1
  //   );
  // };

  // const prevImage = () => {
  //   setCurrentImageIndex((prevIndex) =>
  //     prevIndex - 1 < 0 ? productImages.length - 1 : prevIndex - 1
  //   );
  // };

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
                <p className="product-price">
                  ${product.price?.toFixed(2) || "0.00"}
                </p>
                {/* added average rating */}
                {typeof product.average_rating === "number" ? (
                  <p className="product-rating">
                  ⭐ <span className="rating-text">{product.average_rating.toFixed(1)} / 5</span>
                </p>
                ) : (
                  <p className="product-rating no-reviews">No reviews yet</p>
                )}

                {/* If owner they can see the edit button */}
                {isOwner && (
                  <div className="product-owner-actions">
                    <button
                      className="edit-button"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit
                    </button>
                    {/* If owner they can see the edit button */}
                    <DeleteProduct productId={product.id} />
                  </div>
                )}
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
                        <strong>{review.user?.username}</strong>:{" "}
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
                {productImages.length > 0 ? (
                  productImages.map((imageUrl, index) => (
                    <div key={index} className="gallery-image">
                      <img
                        src={imageUrl}
                        alt={`${product.name} view ${index + 1}`}
                      />
                    </div>
                  ))
                ) : (
                  <div className="gallery-image">
                    <img
                      src="/assets/placeholder.png"
                      alt={`${product.name}`}
                    />
                  </div>
                )}
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
              <div className="product-info-wrapper">
                <h3>{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <p className="product-price">
                  ${product.price?.toFixed(2) || "0.00"}
                </p>

                {typeof product.average_rating === "number" ? (
                  <p className="product-rating">
                    ⭐ <span className="rating-text">{product.average_rating.toFixed(1)} / 5</span>
                  </p>
                ) : (
                  <p className="product-rating no-reviews">No reviews yet</p>
                )}

                {/* making product actions conditional for owner/not owner */}

                <div className="product-actions">
                  {isOwner && (
                    <>
                      <button
                        className="edit-button"
                        onClick={() => setIsEditing(true)}
                      >
                        Edit
                      </button>
                      <DeleteProduct productId={product.id} />
                    </>
                  )}

                  {/* making product actions conditional for owner/not owner */}
                  {!isOwner && (
                    <>
                      <button>
                        <Link
                          to={`/products/${product.id}`}
                          className="learn-more-button"
                        >
                          Learn More
                        </Link>
                      </button>
                      <FavoriteButton productId={product.id} />
                      <button
                        className="add-to-cart-button"
                        onClick={handleAddToCart}
                      >
                        Add to Cart
                      </button>
                    </>
                    /// making product actions conditional on owner/not owner above and below
                  )}
                </div>
              </div>
              {/* making product actions conditional for owner/not owner */}

              <div
                className={`product-images-grid grid-${productImages.length}`}
              >
                {productImages.length > 0 ? (
                  productImages.map((imageUrl, index) => (
                    <div key={index} className="product-image-wrapper">
                      <img
                        src={imageUrl}
                        alt={`${product.name} view ${index + 1}`}
                      />
                    </div>
                  ))
                ) : (
                  <div className="product-image-wrapper">
                    <img
                      src="/assets/placeholder.png"
                      alt={`${product.name}`}
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ProductItem;

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { fetchCurrentUserReviews, removeReview } from "../../redux/reviews";
import EditReviewModal from "../Reviews/EditReviewModal";
import "./Reviews.css";
import "../Favorites/Favorites.css"; //quick fix for a class

export default function CurrentUserReviews() {
  const dispatch = useDispatch();
  const rawReviews = useSelector((state) => state.reviews);
  
  const reviews = useMemo(() => {
    
    const reviewsData = rawReviews.reviews || rawReviews;
    
    const reviewsArray = Object.values(reviewsData);
    
    return reviewsArray;
  }, [rawReviews]);
  
  const [editReview, setEditReview] = useState(null);

  useEffect(() => {
    dispatch(fetchCurrentUserReviews());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      dispatch(removeReview(id));
    }
  };

  const renderStars = (rating) => {
    if (typeof rating !== 'number' || isNaN(rating)) {
      return "☆☆☆☆☆";
    }
    const validRating = Math.min(5, Math.max(0, Math.floor(rating)));
    return "★".repeat(validRating) + "☆".repeat(5 - validRating);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown date";
    const date = new Date(timestamp);
    return isNaN(date.getTime()) ? "Invalid date" : date.toLocaleString();
  };
  
  console.log("All reviews:", reviews);
  
  if (!Array.isArray(reviews)) {
    return (
      <div className="reviews-section">
        <h1 className="reviews-title">MY REVIEWS</h1>
        <p className="no-reviews">Error loading reviews. Please try again later.</p>
      </div>
    );
  }

  return (
    <>
      <div className="reviews-section">
        <h1 className="reviews-title">MY REVIEWS</h1>
        {reviews.length === 0 ? (
          <div className="no-favorites-message">
            <p>Head over to the products page and show some love!</p>
            <Link to="/products">
              <button className="ctaButtonSmall">Browse Products</button>
            </Link>
          </div>
        ) : (
          <div className="review-list">
            {reviews.map((review) => {
              if (!review || typeof review !== 'object' || !review.id) {
                return null;
              }
  
              return (
                <div className="review-item" key={review.id}>
                  {review.product_image && (
                    <img
                      src={review.product_image}
                      alt={review.product_name || "Product"}
                      className="review-product-image"
                    />
                  )}
                  <div className="star-rating">{renderStars(review.rating)}</div>
                  <div className="user-name">{review.product_name || "Unknown Product"}</div>
                  <div className="review-date">
                    Posted on: {formatDate(review.created_at)}
                  </div>
                  <p className="review-description">
                    {review.comment || "No comment provided"}
                  </p>
                  <div className="review-actions">
                    <button
                      className="edit-review-button"
                      onClick={() => setEditReview(review)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-review-button"
                      onClick={() => handleDelete(review.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
  
      {editReview && (
        <EditReviewModal
          review={editReview}
          onClose={() => setEditReview(null)}
        />
      )}
    </>
  );
}
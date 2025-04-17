import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUserReviews, removeReview } from "../../redux/reviews";
import EditReviewModal from "../Reviews/EditReviewModal";
import "./Reviews.css";

export default function CurrentUserReviews() {
  const dispatch = useDispatch();
  const rawReviews = useSelector((state) => state.reviews);
  const reviews = useMemo(() => Object.values(rawReviews), [rawReviews]);
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
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return isNaN(date.getTime()) ? "Invalid date" : date.toLocaleString();
  };
  
  console.log("All reviews:", reviews);
  return (
    <div className="reviews-section">
      <h2 className="reviews-title">MY REVIEWS</h2>
      {reviews.length === 0 ? (
        <p className="no-reviews">You haven’t written any reviews yet.</p>
      ) : (
        <div className="review-list">
          {reviews.map((review) => (
            
            <div className="review-item" key={review.id}>
              {review.product_image && (
                <img
                  src={review.product_image}
                  alt={review.product_name}
                  className="review-product-image"
                />
              )}
              <div className="star-rating">{renderStars(review.rating)}</div>
              <div className="user-name">{review.product_name}</div>
              <div className="review-date">
                Posted on: {formatDate(review.created_at)}{" "}
                {/* ✅ NOW it's scoped */}
              </div>
              <p className="review-description">{review.comment}</p>
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
          ))}
        </div>
      )}

      {editReview && (
        <EditReviewModal
          review={editReview}
          onClose={() => setEditReview(null)}
        />
      )}
    </div>
  );
}

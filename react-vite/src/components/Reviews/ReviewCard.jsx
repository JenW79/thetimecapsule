import DeleteReviewButton from "./DeleteReviewButton";

const StarRating = ({ rating }) => (
  <div className="star-rating">
    {"★".repeat(rating) + "☆".repeat(5 - rating)}
  </div>
);

const ReviewCard = ({ review, sessionUser, onEdit }) => {
  const isOwner = sessionUser?.id === review.user_id;

  return (
    <div className="review-item">
      <StarRating rating={review.rating} />
      <div className="user-name">{review.username}</div>
      <div className="review-date">
        {new Date(review.created_at).toLocaleDateString()}
      </div>
      <p className="review-description">{review.review_text}</p>

      {isOwner && (
        <div className="review-actions">
          <button
            className="edit-review-button"
            onClick={() => onEdit(review)}
          >
            Edit
          </button>
          <DeleteReviewButton reviewId={review.id} />
        </div>
      )}
    </div>
  );
};

export default ReviewCard;

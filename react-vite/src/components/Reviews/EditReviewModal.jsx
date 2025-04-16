import { useState } from "react";
import { useDispatch } from "react-redux";
import { editReview } from "../../redux/reviews";

const EditReviewModal = ({ review, onClose }) => {
  const dispatch = useDispatch();
  const [rating, setRating] = useState(review.rating);
  const [review_text, setReviewText] = useState(review.review_text || "");
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(
      editReview(review.id, { rating, review_text })
    );
    if (result.errors) {
      setErrors(result.errors);
    } else {
      onClose();
    }
  };
  return (
    <div className="review-modal-backdrop">
      <div className="review-modal">
        <h3>Edit Your Review</h3>
        <form className="review-form" onSubmit={handleSubmit}>
          {errors.rating && <p className="error-message">{errors.rating}</p>}

          <div className="rating-selector">
            <label>
              Rating (1–5):
              <input
                type="number"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                min={1}
                max={5}
                required
              />
            </label>
          </div>

          <textarea
            value={review_text}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Update your thoughts..."
          />

          <div className="modal-buttons">
            <button type="submit" className="submit-button">
              Save Changes
            </button>
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditReviewModal;

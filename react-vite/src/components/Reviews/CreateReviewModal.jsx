import { useState } from "react";
import { useDispatch } from "react-redux";
import { createReview } from "../../redux/reviews";
import "./Reviews.css"; 

const CreateReviewModal = ({ productId, onClose }) => {
  const dispatch = useDispatch();
  const [rating, setRating] = useState(5);
  const [review_text, setReviewText] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(
      createReview(productId, { rating, review_text })
    );

    if (result.errors) {
      setErrors(result.errors);
    } else {
      onClose(); // Close modal on successful submission
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Leave a Review</h2>
        <form onSubmit={handleSubmit}>
          {errors.rating && <p className="error">{errors.rating}</p>}
          <label>
            Rating (1–5)
            <input
              type="number"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              min={1}
              max={5}
              required
            />
          </label>

          <label>
            Comment
            <textarea
              value={review_text}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Optional thoughts..."
            />
          </label>

          <div className="modal-buttons">
            <button type="submit" className="submit-button">
              Submit
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

export default CreateReviewModal;


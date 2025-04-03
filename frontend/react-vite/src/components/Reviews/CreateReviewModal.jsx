import { useState } from "react";
import { useDispatch } from "react-redux";
<<<<<<< HEAD
import { createReview } from "../../redux/reviews";
=======
import { createReview } from "../../store/reviews";
>>>>>>> 55a08da (added backend/frontend folders for clairity, working on redux thunks and components)
import { useParams } from "react-router-dom";

const CreateReviewModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const { productId } = useParams(); // fallback if not passed as prop
  const [rating, setRating] = useState(5);
  const [review_text, setReviewText] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(createReview(productId, { rating, review_text }));
    if (result.errors) {
      setErrors(result.errors);
    } else {
      onClose(); // close modal on success
    }
  };

  return (
    <div className="modal">
      <h2>Leave a Review</h2>
      <form onSubmit={handleSubmit}>
        {errors.rating && <p>{errors.rating}</p>}
        <label>
          Rating (1-5)
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
        <button type="submit">Submit</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
};

export default CreateReviewModal;

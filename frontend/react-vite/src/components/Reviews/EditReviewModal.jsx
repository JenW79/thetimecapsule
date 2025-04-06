import { useState } from 'react';
import { useDispatch } from "react-redux";
import { editReview } from "../../redux/reviews";

const EditReviewModal = ({ review, onClose }) => {
    const dispatch = useDispatch();
    const [rating, setRating] = useState(review.rating);
    const [review_text, setReviewText] = useState(review.review_text || "");
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault()
        const result = await dispatch(editReview(review.id, { rating, review_text}))
        if (result.errors) {
            setErrors(result.errors)
        }else{
            onClose()
        }
    }
return (
        <div className="modal">
          <h2>Edit Your Review</h2>
          <form onSubmit={handleSubmit}>
            {errors.rating && <p>{errors.rating}</p>}
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
            <label>
              Comment
              <textarea
                value={review_text}
                onChange={(e) => setReviewText(e.target.value)}
              />
            </label>
            <button type="submit">Save Changes</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </form>
        </div>
      );
    };
    
export default EditReviewModal;

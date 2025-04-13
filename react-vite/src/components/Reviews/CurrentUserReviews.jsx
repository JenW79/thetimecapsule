import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUserReviews, removeReview } from "../../redux/reviews";
import ReviewEditModal from "../Reviews/EditReviewModal";

export default function CurrentUserReviews() {
    const dispatch = useDispatch();
    const rawReviews = useSelector(state => state.reviews);
    const reviews = useMemo(() => Object.values(rawReviews), [rawReviews]);
    useEffect(() => {
        dispatch(fetchCurrentUserReviews());
      }, [dispatch]);
    
      const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this review?")) {
          dispatch(removeReview(id));
        }
      };

      const renderStars = (rating) => {
        return '★'.repeat(rating) + '☆'.repeat(5 - rating);
      };
    
      return (
        <div>
          <h2>My Reviews</h2>
          {reviews.length === 0 ? (
            <p>You haven&rsquo;t written any reviews yet.</p>
          ) : (
            <ul>
              {reviews.map((review) => (
                <li key={review.id} style={{ marginBottom: "1.5rem" }}>
                  <strong>{review.product_name}</strong> — {renderStars(review.rating)}
                  <p>{review.review_text}</p>
                  <small>Posted on: {review.created_at}</small>
                  <br />
                  <button onClick={() => handleDelete(review.id)}>Delete</button>
                  <ReviewEditModal review={review} />
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    }
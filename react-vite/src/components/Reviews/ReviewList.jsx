import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CreateReviewModal from "./CreateReviewModal";
import EditReviewModal from "./EditReviewModal";
import DeleteReviewButton from './DeleteReviewButton';
import { useParams } from "react-router-dom";
import { fetchReviews } from "../../redux/reviews";
import './Reviews.css';

// Adding for star rating
const StarRating = ({ rating }) => {
  return (
    <div className="star-rating">
      {"★".repeat(rating)}
    </div>
  );
};

const ReviewList = () => {
    const dispatch = useDispatch()
    const { productId } = useParams()
    const reviews = useSelector((state) => Object.values(state.reviews || {}));
    const sessionUser = useSelector((state) => state.session.user)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [editReview, setEditReview] = useState(null)

    useEffect(() =>{
        dispatch(fetchReviews(productId))
    }, [dispatch, productId]);

    const userReview = sessionUser
    ? reviews.find((r) => r.user_id === sessionUser.id)
    : null;
    
    // Changing for css/wireframe. Commented out incase we need it later

    // return (
    //     <div>
    //       <h2>Reviews</h2>
    
    //       {!userReview && sessionUser && (
    //         <button onClick={() => setShowCreateModal(true)}>Leave a Review</button>
    //       )}
    
    //       {showCreateModal && (
    //         <CreateReviewModal
    //           onClose={() => setShowCreateModal(false)}
    //         />
    //       )}
    
    //       {editReview && (
    //         <EditReviewModal
    //           review={editReview}
    //           onClose={() => setEditReview(null)}
    //         />
    //       )}
    
    //       {reviews.length === 0 && <p>No reviews yet.</p>}
    
    //       {reviews.map((review) => (
    //         <div key={review.id}>
    //           <h4>{review.username}</h4>
    //           <p>Rating: {review.rating} / 5</p>
    //           <p>{review.review_text}</p>
    //           {sessionUser?.id === review.user_id && (
    //             <>
    //               <button onClick={() => setEditReview(review)}>Edit</button>
    //               <DeleteReviewButton reviewId={review.id} />
    //             </>
    //           )}
    //         </div>
    //       ))}
    //     </div>
    //   );
    // };
    return (
      <div className="reviews-section">
        <h2 className="reviews-title">reviews</h2>
  
        {reviews.length === 0 && <p className="no-reviews">No reviews yet.</p>}
  
        {reviews.map((review) => (
          <div key={review.id} className="review-item">
            <StarRating rating={review.rating} />
            <div className="user-name">{review.username}</div>
            <div className="review-date">{new Date(review.created_at).toLocaleDateString()}</div>
            <p className="review-description">{review.review_text}</p>
            
            {sessionUser?.id === review.user_id && (
              <div className="review-actions">
                <button className="edit-review-button" onClick={() => setEditReview(review)}>
                  Edit
                </button>
                <DeleteReviewButton reviewId={review.id} />
              </div>
            )}
          </div>
        ))}
        
        <div className="review-button-container">
          {!userReview && sessionUser && (
            <button className="leave-review-button" onClick={() => setShowCreateModal(true)}>
              leave a review
            </button>
          )}
        </div>
  
        {showCreateModal && (
          <CreateReviewModal
            onClose={() => setShowCreateModal(false)}
          />
        )}
  
        {editReview && (
          <EditReviewModal
            review={editReview}
            onClose={() => setEditReview(null)}
          />
        )}
      </div>
    );
  };
    export default ReviewList;

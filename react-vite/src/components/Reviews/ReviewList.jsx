import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CreateReviewModal from "./CreateReviewModal";
import EditReviewModal from "./EditReviewModal";
import DeleteReviewButton from './DeleteReviewButton';
import { useParams } from "react-router-dom";
import { fetchReviews } from "../../redux/reviews";

const ReviewList = () => {
    const dispatch = useDispatch()
    const { productId } = useParams()// not passed as a prop for now
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
    
    return (
        <div>
          <h2>Reviews</h2>
    
          {!userReview && sessionUser && (
            <button onClick={() => setShowCreateModal(true)}>Leave a Review</button>
          )}
    
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
    
          {reviews.length === 0 && <p>No reviews yet.</p>}
    
          {reviews.map((review) => (
            <div key={review.id}>
              <h4>{review.username}</h4>
              <p>Rating: {review.rating} / 5</p>
              <p>{review.review_text}</p>
              {sessionUser?.id === review.user_id && (
                <>
                  <button onClick={() => setEditReview(review)}>Edit</button>
                  <DeleteReviewButton reviewId={review.id} />
                </>
              )}
            </div>
          ))}
        </div>
      );
    };
    
    export default ReviewList;

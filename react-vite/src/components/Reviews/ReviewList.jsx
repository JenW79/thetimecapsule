import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchReviews } from "../../redux/reviews";
import CreateReviewModal from "./CreateReviewModal";
import EditReviewModal from "./EditReviewModal";
import DeleteReviewButton from "./DeleteReviewButton";
import ReviewCard from "./ReviewCard";
import "./Reviews.css";
import { createSelector } from "reselect";

// Adding for star rating
const StarRating = ({ rating }) => {
  return <div className="star-rating">{"★".repeat(rating)}</div>;
};

const selectReviews = (state) => state.reviews;
const getMemoizedReviews = createSelector(
  [selectReviews, (_, productId) => productId],
  (reviews, productId) => {
    return Object.values(reviews || {}).filter(
      (review) => review.product_id === Number(productId)
    );
  }
);

const ReviewList = () => {
  const { productId } = useParams();
  const parsedProductId = parseInt(productId, 10);
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);

  const reviews = useSelector((state) =>
    getMemoizedReviews(state, parsedProductId)
  );

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editReview, setEditReview] = useState(null);

  useEffect(() => {
    if (!isNaN(parsedProductId) && parsedProductId > 0) {
      dispatch(fetchReviews(parsedProductId));
    }
  }, [dispatch, parsedProductId]);

  const userReview = useMemo(() => {
    if (!sessionUser) return null;
    return reviews.find((r) => r.user_id === sessionUser.id);
  }, [reviews, sessionUser]);

  if (isNaN(parsedProductId) || parsedProductId <= 0)
    return <div className="error-message">Invalid product ID.</div>;

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
      <h1 className="reviews-title">Reviews</h1>

      {reviews.length > 0 ? (
        <div className="review-list">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              sessionUser={sessionUser}
              onEdit={setEditReview}
            >
              <StarRating rating={review.rating} />
              <div className="user-name">{review.username || "user"}</div>
              <div className="review-date">
                {new Date(review.created_at).toLocaleDateString()}
              </div>
              <p className="review-description">
                {review.review_text || "No comment"}
              </p>
              {sessionUser?.id === review.user_id && (
                <div className="review-actions">
                  <button
                    className="edit-review-button"
                    onClick={() => setEditReview(review)}
                  >
                    Edit
                  </button>
                  <DeleteReviewButton reviewId={review.id} />
                </div>
              )}
            </ReviewCard>
          ))}
        </div>
      ) : (
        <p className="no-reviews">No reviews yet.</p>
      )}
      <div className="review-button-container">
        {!userReview && sessionUser && (
          <button
            className="leave-review-button"
            onClick={() => setShowCreateModal(true)}
          >
            leave a review
          </button>
        )}
      </div>

      {showCreateModal && (
        <CreateReviewModal
          productId={parsedProductId}
          onClose={() => {
            setShowCreateModal(false);
            dispatch(fetchReviews(parsedProductId));
          }}
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
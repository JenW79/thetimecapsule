const LOAD_REVIEWS = 'reviews/load'; 
const ADD_REVIEW = 'reviews/add';
const UPDATE_REVIEW = 'reviews/update';
const DELETE_REVIEW = 'reviews/delete';

const loadReviews = (reviews) => ({type: LOAD_REVIEWS, reviews});
const addReview = (review) => ({ type: ADD_REVIEW, review });
const updateReview = (review) => ({ type: UPDATE_REVIEW, review });
const deleteReview = (reviewId) => ({ type: DELETE_REVIEW, reviewId });

//THUNKS

export const fetchReviews = (productId) => async (dispatch) => {
    const res = await fetch(`/api/products/${productId}/reviews`);
    if(res.ok){
        const data = await res.json()
        dispatch(loadReviews(data.reviews))
    }
}
export const createReview = (productId, payload) => async (dispatch) => {
  const res = await fetch(`/api/products/${productId}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (res.ok) {
    const data = await res.json();
    dispatch(addReview(data)); 
    return data;
  } else {
    const error = await res.json();
    return error;
  }
};
export const editReview = (reviewId, payload) => async (dispatch) => {
    const res = await fetch(`/api/reviews/${reviewId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      const data = await res.json();
      dispatch(updateReview(data));
      return data;
    } else {
      const error = await res.json();
      return error;
    }
  };
  export const removeReview = (reviewId) => async (dispatch) => {
    const res = await fetch(`/api/reviews/${reviewId}`, { method: "DELETE" });
    if (res.ok) {
      dispatch(deleteReview(reviewId));
    }
  };

  const initialState = {};
  export default function reviewsReducer(state = initialState, action) {
    switch (action.type) {
      case LOAD_REVIEWS: {
        const newState = {};
        action.reviews.forEach((review) => {
          newState[review.id] = review;
        });
        return newState;
      }
      case ADD_REVIEW:
        return { ...state, [action.review.id]: action.review };
      case UPDATE_REVIEW:
        return { ...state, [action.review.id]: action.review };
      case DELETE_REVIEW: {
        const stateCopy = { ...state };
        delete stateCopy[action.reviewId];
        return stateCopy;
      }
      default:
        return state;
    }
  }

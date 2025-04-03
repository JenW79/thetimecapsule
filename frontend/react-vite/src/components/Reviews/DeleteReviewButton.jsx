<<<<<<< HEAD
=======
/* eslint-disable no-unused-vars */

>>>>>>> 55a08da (added backend/frontend folders for clairity, working on redux thunks and components)
import { useDispatch } from 'react-redux';
import { removeReview } from "../../redux/reviews";

const DeleteReviewButton = ({ reviewId }) => {
<<<<<<< HEAD
    const dispatch = useDispatch()
    
    const handleDelete = async () => {
        const confirm = window.confirm("Are you sure you want to delete this review?")
        if (confirm) {
            dispatch(removeReview(reviewId))
        }
    }
     return (
        <button onClick={handleDelete}>
          Delete
        </button>
      )
    };
    
    export default DeleteReviewButton;
=======
    const dispatch = useDispatch();
    
}
>>>>>>> 55a08da (added backend/frontend folders for clairity, working on redux thunks and components)

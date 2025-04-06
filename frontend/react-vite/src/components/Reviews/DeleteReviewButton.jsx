import { useDispatch } from 'react-redux';
import { removeReview } from "../../redux/reviews";

const DeleteReviewButton = ({ reviewId }) => {
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

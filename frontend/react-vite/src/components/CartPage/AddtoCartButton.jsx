import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/cart';

const AddtoCartButton = ({ item }) => {
    const dispatch = useDispatch();

    const handleAdd = async () => {
        dispatch(addToCart(item));
    };

    return (
        <button onClick={handleAdd}>
            Add to Cart
        </button>
    );
}

export default AddtoCartButton;
import { useState, useEffect } from 'react';
// importing react is depreciated as Vite with React 17+ and JSX transform, 
// you no longer need to import React in every file.
import { useDispatch } from 'react-redux';
import { editProduct} from '../../redux/products';
import { addToCart } from '../../redux/cart';
import EditProductForm from './EditProductForm';
import DeleteProduct from './DeleteProduct';
import FavoriteButton from '../Favorites/FavoriteButton';

const ProductItem = ({ product }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [productImages, setProductImages] = useState([]);

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  const handleProductUpdate = async (updatedData) => {
    await dispatch(editProduct(product.id, updatedData));
    setIsEditing(false);
  };

  // Determine if we're on a product detail page or a listing page
  const isDetailPage = window.location.pathname.includes(`/product/${product.id}`);

  // Process the product images when the product changes
  useEffect(() => {
    const parseImages = () => {
      console.log("Processing images for product:", product.id);
      console.log("Raw product data:", product);
      
      // If product has a pre-parsed images array, use it
      if (product.images && Array.isArray(product.images) && product.images.length > 0) {
        console.log("Using pre-parsed images array:", product.images);
        return product.images;
      }
      
      // Try to parse the image_url if it looks like JSON
      if (typeof product.image_url === 'string') {
        try {
          // Handle case where the string might have extra quotes or formatting issues
          let cleanedString = product.image_url.replace(/^"|"$/g, '');
          
          // Check if it starts with a bracket (likely an array)
          if (cleanedString.trim().startsWith('[')) {
            const parsedImages = JSON.parse(cleanedString);
            console.log("Successfully parsed JSON array from image_url:", parsedImages);
            return Array.isArray(parsedImages) ? parsedImages : [product.image_url];
          }
        } catch (e) {
          console.error("Failed to parse image_url as JSON:", e);
        }
        
        // If it's a comma-separated string, split it
        if (product.image_url.includes(',')) {
          const splitImages = product.image_url.split(',').map(url => url.trim());
          console.log("Split comma-separated image string into array:", splitImages);
          return splitImages;
        }
        
        // Just use the single image_url
        console.log("Using image_url as single image:", product.image_url);
        return [product.image_url];
      }
      
      console.log("No valid images found, using placeholder");
      return ['/assets/placeholder.png'];
    };
    
    const images = parseImages();
    console.log("Final processed images:", images);
    setProductImages(images);
  }, [product]);

  // Safely get image by index with fallback
  const getImageByIndex = (index) => {
    if (index < productImages.length) {
      return productImages[index];
    }
    return productImages[0] || '/assets/placeholder.png';
  };

  return (
    <div className={isDetailPage ? "product-detail" : "product-item"}>
      {isEditing ? (
        <EditProductForm 
          product={product}
          onProductUpdated={handleProductUpdate}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <>
          {isDetailPage ? (
            // Product detail page layout
            <div className="product-container">
              <div className="product-info">
                <h1 className="product-title">{product.name}</h1>
                <p className="product-description">{product.description}</p>
                <p className="product-price">${product.price.toFixed(2)}</p>
                <button 
                  className="add-to-cart-button"
                  onClick={handleAddToCart}
                >
                  add to cart
                </button>
              </div>
              <div className="product-gallery">
                {/* Generate gallery images dynamically based on available images */}
                {[0, 1, 2, 3].map(index => (
                  <div key={index} className="gallery-image">
                    <img 
                      src={getImageByIndex(index)} 
                      alt={`${product.name} view ${index + 1}`} 
                    />
                  </div>
                ))}
                <div className="pattern-image">
                  <img src="/assets/sprinkle-green.png" alt="Decorative pattern" />
                </div>
              </div>
            </div>
          ) : (
            // Product list item layout
            <>
              <div className="product-thumbnail">
                <img src={getImageByIndex(0)} alt={product.name} />
              </div>
              <h3>{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <p className="product-price">${product.price.toFixed(2)}</p>
              
              <div className="product-actions">
                <button 
                  className="edit-button"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
                <DeleteProduct productId={product.id} />
                <FavoriteButton productId={product.id} />
                <button 
                  className="add-to-cart-button"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ProductItem;
import { useState } from 'react';
import './Products.css';

const EditProductForm = ({ product, onProductUpdated, onCancel }) => {
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description,
    price: product.price.toString()
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.description || !formData.price) {
      setError('All fields are required');
      return;
    }

    if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      setError('Price must be a positive number');
      return;
    }

    try {
      const updatedData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price)
      };
      
      await onProductUpdated(updatedData);
      
    } catch (error) {
      setError('Error updating product. Please try again.');
      console.error('Error updating product:', error);
    }
  };

  return (
    <div className="edit-product-form">
      <h3>Edit Product</h3>
      
      {error && <p className="error-message">{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="edit-name">Product Name</label>
          <input
            type="text"
            id="edit-name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="edit-description">Description</label>
          <textarea
            id="edit-description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="edit-price">Price ($)</label>
          <input
            type="text"
            id="edit-price"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-actions">
          <button type="submit" className="update-button">Update</button>
          <button type="button" className="cancel-button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProductForm;
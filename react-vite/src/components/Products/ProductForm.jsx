import  { useState } from 'react';
// importing react is depreciated as Vite with React 17+ and JSX transform, 
// you no longer need to import React in every file.
import { useDispatch } from 'react-redux';
import { createProduct } from '../../redux/products';
import './Products.css';

const ProductForm = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: ''
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
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price)
      };
      
      const result = await dispatch(createProduct(productData));
      
      if (result.errors) {
        setError(result.errors);
      } else {
        // Reset form after successful creation
        setFormData({
          name: '',
          description: '',
          price: ''
        });
        setError('');
      }
    } catch (error) {
      setError('Error creating product. Please try again.');
      console.error('Error creating product:', error);
    }
  };

  return (
    <div className="product-form-container">
      <h2>Add New Product</h2>
      
      {error && <p className="error-message">{error}</p>}
      
      <form className="product-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Product Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter product name"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter product description"
            rows="3"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="price">Price ($)</label>
          <input
            type="text"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Enter product price"
          />
        </div>
        
        <button type="submit" className="submit-button">Create Product</button>
      </form>
    </div>
  );
};

export default ProductForm;
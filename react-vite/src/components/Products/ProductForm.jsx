import { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { createProduct } from "../../redux/products";
import { useNavigate } from "react-router-dom";
import "./Products.css";

const ProductForm = () => {
  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  
  useEffect(() => {
    if (!user) {
      navigate('/login'); // if user is not logged in
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
    decade: "",
    category: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.description || !formData.price) {
      setError("All fields are required");
      return;
    }

    if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      setError("Price must be a positive number");
      return;
    }

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        image_url: formData.image_url,
        decade: formData.decade,
        category: formData.category,
      };

      const result = await dispatch(createProduct(productData));

      if (result.errors || result.message) {
        setError(result.errors || result.message);
      } else {
        // Reset form after successful creation
        setFormData({
          name: "",
          description: "",
          price: "",
          image_url: "",
          decade: "",
          category: "",
        });
        setError("");
        navigate("/my-products");
      }
    } catch (error) {
      setError("Error creating product. Please try again.");
      console.error("Error creating product:", error);
    }
  };

  return (
    <div className="product-form-container">
      <h2>Add New Product</h2>

      {/* {error && <p className="error-message">{error}</p>} this was throwing object errors */}

      {error && typeof error === "object" ? (
        <ul className="error-message">
          {Object.entries(error).map(([field, messages]) => (
            <li key={field}>
              {field}:{" "}
              {Array.isArray(messages) ? messages.join(", ") : messages}
            </li>
          ))}
        </ul>
      ) : (
        error && <p className="error-message">{error}</p>
      )}

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
        <div className="form-group">
          <label htmlFor="decade">Decade</label>
          <select
            id="decade"
            name="decade"
            value={formData.decade}
            onChange={handleChange}
          >
            <option value="">Select a decade</option>
            <option value="80s">1980s</option>
            <option value="90s">1990s</option>
            <option value="00s">2000s</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Select a category</option>
            <option value="toy">Toy</option>
            <option value="game">Game</option>
            <option value="electronic">Electronic</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="image_url">Image URL</label>
          <input
            type="text"
            id="image_url"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            placeholder="Enter image URL"
          />
        </div>

        <button type="submit" className="submit-button">
          Create Product
        </button>
      </form>
    </div>
  );
};

export default ProductForm;

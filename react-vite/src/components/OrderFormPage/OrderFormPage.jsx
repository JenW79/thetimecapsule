import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../../redux/cart";
import "./OrderFormPage.css";

const OrderFormPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(state => state.cart.cartItems);
  const user = useSelector(state => state.session.user);
  
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    street_address: "",
    zip_code: "",
    city: "",
    country: "",
    state: "",
    payment_method: "",
    expiration_date: "",
    cvv: "",
    card_number: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [orders, setOrders] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/signup");
    }
  }, [user, navigate]);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    if (savedOrders.length > 0) {
      setOrders(savedOrders);
    }
  }, []);

  useEffect(() => {
    if (cartItems.length === 0 && !successMessage) {
      navigate("/checkout");
    }
  }, [cartItems, navigate, successMessage]);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0).toFixed(2);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateCardDetails = () => {
    if (!['Credit Card', 'Debit Card'].includes(formData.payment_method)) {
      return null;
    }

    const expirationDatePattern = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expirationDatePattern.test(formData.expiration_date)) {
      return "Expiration Date must be in MM/YY format.";
    }

    const [expMonth, expYear] = formData.expiration_date.split("/").map(Number);
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear() % 100;

    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
      return "Card is expired.";
    }

    const cvvPattern = /^\d{3,4}$/;
    if (!cvvPattern.test(formData.cvv)) {
      return "CVV must be 3 or 4 digits.";
    }

    const cardNumberPattern = /^\d{16}$/;
    if (!cardNumberPattern.test(formData.card_number)) {
      return "Card Number must be exactly 16 digits.";
    }

    const zipCodePattern = /^\d+$/;
    if (!zipCodePattern.test(formData.zip_code)) {
      return "Zip Code must be a number.";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    if (cartItems.length === 0) {
      setErrorMessage("Your cart is empty. Please add items before checking out.");
      setIsSubmitting(false);
      return;
    }

    const validationError = validateCardDetails();
    if (validationError) {
      setErrorMessage(validationError);
      setIsSubmitting(false);
      return;
    }

    const formDataToSubmit = {
      ...formData,
      zip_code: formData.zip_code ? parseInt(formData.zip_code, 10) : 0,
      products: cartItems.map(item => ({
        product_id: item.product_id,
        name: item.name || "Unknown Product",
        quantity: item.quantity,
        price: item.price
      }))
    };

    try {
      if (user) {
        try {
          const response = await fetch("/api/checkout", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              order_submission: true,
              ...formDataToSubmit
            }),
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "There was an error submitting the order.");
          }
          
          const data = await response.json();
          setSuccessMessage("Order submitted successfully! Thank you for your purchase.");
          
          const orderSummary = {
            customer: {
              first_name: formData.first_name,
              last_name: formData.last_name,
              street_address: formData.street_address,
              zip_code: formData.zip_code,
              city: formData.city,
              state: formData.state,
              country: formData.country
            },
            payment_method: formData.payment_method,
          items: data.order_details?.items || formDataToSubmit.products.map(product => ({
            product_id: product.product_id,
            product_name: product.name,
            quantity: product.quantity,
            price: product.price,
            subtotal: product.price * product.quantity
          })),
          total_amount: data.order_details?.total_amount || 
            formDataToSubmit.products.reduce((total, item) => total + (item.price * item.quantity), 0),
          order_date: new Date().toISOString()
        };
        
        const savedOrders = JSON.parse(localStorage.getItem('orderHistory') || '[]');
        savedOrders.push(orderSummary);
        localStorage.setItem('orderHistory', JSON.stringify(savedOrders));
          setOrders([...orders, orderSummary]);
          
          setFormData({
            first_name: "",
            last_name: "",
            street_address: "",
            zip_code: "",
            city: "",
            country: "",
            state: "",
            payment_method: "",
            expiration_date: "",
            cvv: "",
            card_number: "",
          });
          
          dispatch(clearCart());
        } catch (error) {
          console.error("API error:", error);
          processOrderLocally(formDataToSubmit);
        }
      } else {
        navigate("/signup");
        return;
      }
    } catch (error) {
      setErrorMessage(error.message || "There was an error submitting the order.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const processOrderLocally = (orderData) => {
    const orderSummary = {
      customer: {
        first_name: orderData.first_name,
        last_name: orderData.last_name,
        street_address: orderData.street_address,
        zip_code: orderData.zip_code,
        city: orderData.city,
        state: orderData.state,
        country: orderData.country
      },
      payment_method: orderData.payment_method,
      items: orderData.products.map(product => ({
        product_id: product.product_id,
        product_name: product.name,
        quantity: product.quantity,
        price: product.price,
        subtotal: product.price * product.quantity
      })),
      total_amount: orderData.products.reduce((total, item) => 
        total + (item.price * item.quantity), 0),
      order_date: new Date().toISOString()
    };

    const savedOrders = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    savedOrders.push(orderSummary);
    localStorage.setItem('orderHistory', JSON.stringify(savedOrders));
    
    setSuccessMessage("Order submitted successfully! Thank you for your purchase.");
    setOrders([...orders, orderSummary]);
    
    setFormData({
      first_name: "",
      last_name: "",
      street_address: "",
      zip_code: "",
      city: "",
      country: "",
      state: "",
      payment_method: "",
      expiration_date: "",
      cvv: "",
      card_number: "",
    });
    
    dispatch(clearCart());
  };

  const handleCancel = () => {
    navigate("/cart");
  };

  const showCardFields = ['Credit Card', 'Debit Card'].includes(formData.payment_method);

  return (
    <div className="order-form-container">
      <h2>Checkout</h2>
      
      {cartItems.length > 0 && (
        <div className="order-summary">
          <h3>Order Summary</h3>
          <ul className="cart-items-list">
            {cartItems.map((item, index) => (
              <li key={index} className="cart-item">
                <div className="item-details">
                  <span className="item-name">{item.name || "Product"}</span>
                  <span className="item-quantity">Qty: {item.quantity}</span>
                </div>
                <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="order-total">
            <strong>Total:</strong> ${calculateTotal()}
          </div>
        </div>
      )}

      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      {!successMessage && (
        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="form-section">
            <h3>Shipping Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="first_name">First Name</label>
                <input
                  id="first_name"
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="last_name">Last Name</label>
                <input
                  id="last_name"
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="street_address">Street Address</label>
              <input
                id="street_address"
                type="text"
                name="street_address"
                value={formData.street_address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="state">State</label>
                <input
                  id="state"
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="zip_code">Zip Code</label>
                <input
                  id="zip_code"
                  type="text"
                  name="zip_code"
                  value={formData.zip_code}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="country">Country</label>
                <input
                  id="country"
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Payment Information</h3>
            
            <div className="form-group">
              <label htmlFor="payment_method">Payment Method</label>
              <select
                id="payment_method"
                name="payment_method"
                value={formData.payment_method}
                onChange={handleChange}
                required
              >
                <option value="">Select Payment Method</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="PayPal">PayPal</option>
                <option value="Apple Pay">Apple Pay</option>
                <option value="Google Pay">Google Pay</option>
                <option value="Amazon Pay">Amazon Pay</option>
                <option value="Samsung Pay">Samsung Pay</option>
                <option value="Venmo">Venmo</option>
                <option value="Stripe">Stripe</option>
                <option value="Affirm">Affirm</option>
                <option value="Klarna">Klarna</option>
                <option value="Zip">Zip</option>
                <option value="Sezzle">Sezzle</option>
                <option value="Afterpay">Afterpay</option>
              </select>
            </div>

            {showCardFields && (
              <>
                <div className="form-group">
                  <label htmlFor="card_number">Card Number</label>
                  <input
                    id="card_number"
                    type="text"
                    name="card_number"
                    value={formData.card_number}
                    onChange={handleChange}
                    placeholder="1234567890123456"
                    required={showCardFields}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="expiration_date">Expiration Date (MM/YY)</label>
                    <input
                      id="expiration_date"
                      type="text"
                      name="expiration_date"
                      value={formData.expiration_date}
                      onChange={handleChange}
                      placeholder="MM/YY"
                      required={showCardFields}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="cvv">CVV</label>
                    <input
                      id="cvv"
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleChange}
                      placeholder="123"
                      required={showCardFields}
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="cancel-button"
              disabled={isSubmitting}
            >
              Back to Cart
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Place Order"}
            </button>
          </div>
        </form>
      )}

      {orders.length > 0 && (
        <div className="order-history">
          <h3>Order History</h3>
          <ul>
            {orders.length > 0 ? (
              orders.map((order, index) => (
                <li key={index}>
                  <strong>Order #{index + 1}:</strong>
                  <ul>
                    <li>Customer: {`${order.customer?.first_name || order.first_name} ${order.customer?.last_name || order.last_name}`}</li>
                    <li>Street Address: {order.customer?.street_address || order.street_address}</li>
                    <li>Zip Code: {order.customer?.zip_code || order.zip_code}</li>
                    <li>City: {order.customer?.city || order.city}</li>
                    <li>Country: {order.customer?.country || order.country}</li>
                    <li>State: {order.customer?.state || order.state}</li>
                    <li>Payment Method: {order.payment_method}</li>
                    
                    <li>
                      <strong>Products:</strong>
                      {(order.products || order.items || []).length > 0 ? (
                        <ul>
                          {(order.products || order.items || []).map((product, idx) => (
                            <li key={idx}>
                              {product.name || product.product_name} - <strong>Quantity:</strong> {product.quantity} - <strong>Price:</strong> ${product.price.toFixed(2)}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span> No products in this order.</span>
                      )}
                    </li>
                    
                    <li>
                      <strong>Total:</strong> ${(order.total_amount || 
                        ((order.products || order.items) ? (order.products || order.items).reduce((sum, item) => sum + (item.price * item.quantity), 0) : 0)
                      ).toFixed(2)}
                    </li>
                    
                    {order.order_date && (
                      <li>Date: {new Date(order.order_date).toLocaleDateString()}</li>
                    )}
                  </ul>
                </li>
              ))
            ) : (
              <li>No orders yet.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default OrderFormPage;
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCart, clearCart } from "../../redux/cart";
import "./OrderFormPage.css";

const OrderFormPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const user = useSelector((state) => state.session.user);

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

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [orders, setOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orderHistory") || "[]");
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
    return cartItems
      .reduce((total, item) => {
        const price = parseFloat(item.product?.price) || 0;
        const quantity = parseInt(item.quantity) || 0;
        return total + (price * quantity);
      }, 0)
      .toFixed(2);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "zip_code") {
      if (!/^\d*$/.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          zip_code: "Zip Code must be a number.",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          zip_code: undefined,
        }));
      }
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: undefined,
      }));
    }

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: undefined,
    }));
  };

  const validateFields = () => {
    const newErrors = {};
    const requiredFields = [
      "first_name",
      "last_name",
      "street_address",
      "zip_code",
      "city",
      "country",
      "state",
      "payment_method",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) newErrors[field] = "This field is required.";
    });

    if (!/^\d+$/.test(formData.zip_code)) {
      newErrors.zip_code = "Zip Code must be a number.";
    }

    if (["Credit Card", "Debit Card"].includes(formData.payment_method)) {
      const expirationDatePattern = /^(0[1-9]|1[0-2])\/\d{2}$/;
      const cvvPattern = /^\d{3,4}$/;
      const cardNumberPattern = /^\d{16}$/;

      if (!expirationDatePattern.test(formData.expiration_date)) {
        newErrors.expiration_date = "Expiration Date must be in MM/YY format.";
      } else {
        const [expMonth, expYear] = formData.expiration_date.split("/").map(Number);
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear() % 100;
        if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
          newErrors.expiration_date = "Card is expired.";
        }
      }

      if (!cvvPattern.test(formData.cvv)) {
        newErrors.cvv = "CVV must be 3 or 4 digits.";
      }

      if (!cardNumberPattern.test(formData.card_number)) {
        newErrors.card_number = "Card Number must be exactly 16 digits.";
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");
    setIsSubmitting(true);
    if (cartItems.length === 0) {
      setErrorMessage("Your cart is empty. Please add items before checking out.");
      setIsSubmitting(false);
      return;
    }

    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    const formDataToSubmit = {
      ...formData,
      zip_code: parseInt(formData.zip_code, 10),
      products: cartItems
        .filter((item) => item.product)
        .map((item) => ({
          product_id: item.product_id,
          name: item.product?.name || "Unknown Product",
          quantity: item.quantity,
          price: item.product?.price || 0,
        })),
    };

    try {
      if (user) {
        try {
          const response = await fetch("/api/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ order_submission: true, ...formDataToSubmit }),
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
              country: formData.country,
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
              formDataToSubmit.products.reduce((total, item) =>
                total + (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0), 0),
            order_date: new Date().toISOString(),
          };

          const savedOrders = JSON.parse(localStorage.getItem("orderHistory") || "[]");
          savedOrders.push(orderSummary);
          localStorage.setItem("orderHistory", JSON.stringify(savedOrders));
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
          processOrderLocally(formDataToSubmit);
        }
      } else {
        navigate("/");
        return;
      }
    } catch (error) {
      setErrorMessage(error.message || "There was an error submitting the order.");
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
        country: orderData.country,
      },
      payment_method: orderData.payment_method,
      items: orderData.products.map(product => ({
        product_id: product.product_id,
        product_name: product.name,
        quantity: product.quantity,
        price: product.price,
        subtotal: product.price * product.quantity,
      })),
      total_amount: orderData.products.reduce((total, item) =>
        total + (item.price * item.quantity), 0),
      order_date: new Date().toISOString(),
    };

    const savedOrders = JSON.parse(localStorage.getItem("orderHistory") || "[]");
    savedOrders.push(orderSummary);
    localStorage.setItem("orderHistory", JSON.stringify(savedOrders));
    setOrders([...orders, orderSummary]);
    setSuccessMessage("Order submitted successfully! Thank you for your purchase.");

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

  const showCardFields = ["Credit Card", "Debit Card"].includes(formData.payment_method);

  return (
    <div>
      <h2>checkout</h2>
      {cartItems.length > 0 && (
        <div>
          <h3>order summary</h3>
          {cartItems.map((item) => (
            <div key={item.id}>
              <div>
                {(() => {
                  let imageUrl = "";
                  if (item.product) {
                    if (Array.isArray(item.product?.image_url) && item.product.image_url.length > 0) {
                      imageUrl = item.product.image_url[0];
                    } else if (typeof item.product?.image_url === "string") {
                      try {
                        const parsed = JSON.parse(item.product.image_url);
                        imageUrl = Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : item.product.image_url;
                      } catch {
                        imageUrl = item.product.image_url;
                      }
                    }
                  }

                  return imageUrl ? (
                    <div className="product-image-wrapper">
                      <img src={imageUrl || "/placeholder-image.jpg"} alt={item.product?.name || "Product"} />
                    </div>
                  ) : (
                    <div>No Image</div>
                  );
                })()}
              </div>
              <div>
                <h4>{item.product?.name || "Unknown Product"}</h4>
                <p>quantity: {item.quantity}</p>
                <p>price: ${item.product?.price?.toFixed(2) || 0}</p>
                <p>subtotal: ${(item.product?.price * item.quantity || 0).toFixed(2)}</p>
              </div>
            </div>
          ))}
          <div>
            <h3>total: ${calculateTotal()}</h3>
          </div>
        </div>
      )}

      <br />
      {successMessage && <div className="success-message">{successMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {!successMessage && (
        <form onSubmit={handleSubmit}>
          <h3>shipping information</h3>

          <div>
            {errors.first_name && <div className="error-message">{errors.first_name}</div>}
            <label htmlFor="first_name">first name</label>
            <input id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} required />
          </div>

          <div>
            {errors.last_name && <div className="error-message">{errors.last_name}</div>}
            <label htmlFor="last_name">last name</label>
            <input id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} required />
          </div>

          <div>
            {errors.street_address && <div className="error-message">{errors.street_address}</div>}
            <label htmlFor="street_address">street address</label>
            <input id="street_address" name="street_address" value={formData.street_address} onChange={handleChange} required />
          </div>

          <div>
            {errors.city && <div className="error-message">{errors.city}</div>}
            <label htmlFor="city">city</label>
            <input id="city" name="city" value={formData.city} onChange={handleChange} required />
          </div>

          <div>
            {errors.state && <div className="error-message">{errors.state}</div>}
            <label htmlFor="state">state</label>
            <input id="state" name="state" value={formData.state} onChange={handleChange} required />
          </div>

          <div>
            {errors.zip_code && <div className="error-message">{errors.zip_code}</div>}
            <label htmlFor="zip_code">zip code</label>
            <input id="zip_code" name="zip_code" value={formData.zip_code} onChange={handleChange} required />
          </div>

          <div>
            {errors.country && <div className="error-message">{errors.country}</div>}
            <label htmlFor="country">country</label>
            <input id="country" name="country" value={formData.country} onChange={handleChange} required />
          </div>

          <h3>payment information</h3>

          <div>
            {errors.payment_method && <div className="error-message">{errors.payment_method}</div>}
            <label htmlFor="payment_method">payment method</label>
            <select id="payment_method" name="payment_method" value={formData.payment_method} onChange={handleChange} required>
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
              <div>
                {errors.card_number && <div className="error-message">{errors.card_number}</div>}
                <label htmlFor="card_number">card number</label>
                <input id="card_number" name="card_number" value={formData.card_number} onChange={handleChange} required />
              </div>

              <div>
                {errors.expiration_date && <div className="error-message">{errors.expiration_date}</div>}
                <label htmlFor="expiration_date">expiration date (mm/yy)</label>
                <input id="expiration_date" name="expiration_date" value={formData.expiration_date} onChange={handleChange} required />
              </div>

              <div>
                {errors.cvv && <div className="error-message">{errors.cvv}</div>}
                <label htmlFor="cvv">cvv</label>
                <input id="cvv" name="cvv" value={formData.cvv} onChange={handleChange} required />
              </div>
            </>
          )}
          <br />
          <div>
            <button type="button" onClick={handleCancel} disabled={isSubmitting}>back to cart</button>
            <button type="submit" disabled={isSubmitting}>{isSubmitting ? "Processing..." : "place order"}</button>
          </div>
        </form>
      )}

      {orders.length > 0 && (
        <div>
          <h3>order history</h3>
          {orders.map((order, index) => (
            <div key={index}>
              <h4>order #{index + 1}</h4>
              <p>customer: {`${order.customer?.first_name || order.first_name} ${order.customer?.last_name || order.last_name}`}</p>
              <p>street address: {order.customer?.street_address || order.street_address}</p>
              <p>zip code: {order.customer?.zip_code || order.zip_code}</p>
              <p>city: {order.customer?.city || order.city}</p>
              <p>country: {order.customer?.country || order.country}</p>
              <p>state: {order.customer?.state || order.state}</p>
              <p>payment method: {order.payment_method}</p>
              <p>products:</p>
              {(order.products || order.items || []).map((product, idx) => (
                <div key={idx}>
                  <p>{product.name || product.product_name}</p>
                  <p>quantity: {product.quantity}</p>
                  <p>price: ${parseFloat(product.price).toFixed(2)}</p>
                </div>
              ))}
              <p>total: ${(order.total_amount || (order.products || order.items || []).reduce((sum, item) => {
                const price = parseFloat(item.price) || 0;
                const quantity = parseInt(item.quantity) || 0;
                return sum + (price * quantity);
              }, 0)).toFixed(2)}</p>
              {order.order_date && (
                <p>date: {new Date(order.order_date).toLocaleDateString()}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderFormPage;
import { useState } from "react";

const OrderFormPage = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    street_address: "",
    zip_code: "",
    city: "",
    country: "",
    state: "",
    payment_method: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [orders, setOrders] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSubmit = {
      ...formData,
      zip_code: parseInt(formData.zip_code, 10 || 0)
    };

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataToSubmit),
      });

      if (!response.ok) {
        throw new Error("Failed to submit the order");
      }

      const data = await response.json();
      setSuccessMessage("Order submitted successfully!");
      setOrders((prevOrders) => [...prevOrders, data.order_data]);
      setFormData({
        first_name: "",
        last_name: "",
        street_address: "",
        zip_code: "",
        city: "",
        country: "",
        state: "",
        payment_method: "",
      });
    } catch (error) {
      setErrorMessage("There was an error submitting the order.");
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Order Form</h2>
      {errorMessage && <div className="error">{errorMessage}</div>}
      {successMessage && <div className="success">{successMessage}</div>}

      <form onSubmit={handleSubmit}>
        <label>First Name</label>
        <input
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          required
        />

        <label>Last Name</label>
        <input
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          required
        />

        <label>Street Address</label>
        <input
          type="text"
          name="street_address"
          value={formData.street_address}
          onChange={handleChange}
          required
        />

        <label>Zip Code</label>
        <input
          type="text"
          name="zip_code"
          value={formData.zip_code}
          onChange={handleChange}
          required
        />

        <label>City</label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
        />

        <label>Country</label>
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleChange}
          required
        />

        <label>State</label>
        <input
          type="text"
          name="state"
          value={formData.state}
          onChange={handleChange}
          required
        />

        <label>Payment Method</label>
        <select
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

        <button type="submit">Submit Order</button>
      </form>

      <div>
        <h3>Order History</h3>
        <ul>
          {orders.length > 0 ? (
            orders.map((order, index) => (
              <li key={index}>
                <strong>Order #{index + 1}:</strong>
                <ul>
                  <li>First Name: {order.first_name}</li>
                  <li>Last Name: {order.last_name}</li>
                  <li>Street Address: {order.street_address}</li>
                  <li>Zip Code: {order.zip_code}</li>
                  <li>City: {order.city}</li>
                  <li>Country: {order.country}</li>
                  <li>State: {order.state}</li>
                  <li>Payment Method: {order.payment_method}</li>
                </ul>
              </li>
            ))
          ) : (
            <li>No orders yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default OrderFormPage;
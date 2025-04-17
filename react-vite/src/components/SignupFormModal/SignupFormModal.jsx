import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkSignup } from "../../redux/session";
import "./SignupForm.css";



function SignupFormModal({ embedded = false }) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
  
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = "Please enter a valid email address.";
    }
  
    if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }
  
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Confirm Password must match Password.";
    }
  
    if (Object.keys(newErrors).length > 0) {
      return setErrors(newErrors);
    }
  
    const serverResponse = await dispatch(
      thunkSignup({
        email: email.toLowerCase(),
        username,
        password,
      })
    );
  
    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
    }
  };

  return (
    <div className={embedded ? "" : "signup-form-container"}>
      {!embedded && <h1>Sign Up</h1>}
      <form className="signup-form" onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {errors.email && <p className="error-message">{errors.email}</p>}

        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        {errors.username && <p className="error-message">{errors.username}</p>}

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {errors.password && <p className="error-message">{errors.password}</p>}

        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {errors.confirmPassword && (
          <p className="error-message">{errors.confirmPassword}</p>
        )}

        {errors.server && <p className="error-message">{errors.server}</p>}

        <button
          type="submit"
          className="signup-button"
          disabled={!email || !username || !password || !confirmPassword}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignupFormModal;

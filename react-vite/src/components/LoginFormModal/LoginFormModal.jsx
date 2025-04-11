import { useState } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal({ embedded = false }) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(
      thunkLogin({
        email: email.toLowerCase(), //ensures email stays lowercase
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
    }
  };

  const loginAsDemoUser = () => {
    dispatch(thunkLogin({ email: "demo@aa.io", password: "password" }))
      .then(closeModal);
  };

  return (
    <>
     <div className={embedded ? "" : "login-form-container"}>
      {!embedded && <h1>Sign In</h1>}
      <form className="login-form" onSubmit={handleSubmit}>
  <label htmlFor="email">Email address</label>
  <input
    id="email"
    type="text"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
  />
  {errors.email && <p>{errors.email}</p>}
  <label htmlFor="password">Password</label>
  <input
    id="password"
    type="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
  />
  {errors.password && <p>{errors.password}</p>}
  {errors.message && <p className="error-text">{errors.message}</p>} 
  <button
    type="submit"
    className={`login-button ${!email || !password ? "disabled-login" : ""}`}
    disabled={!email || !password}
  >
    Sign In
  </button>
</form>
      <p className="demo-user-text" onClick={loginAsDemoUser}>
       Sign in as Demo User
      </p>
      </div>
    </>
    
  );
}

export default LoginFormModal;

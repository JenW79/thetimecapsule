import { useState } from "react";
import LoginFormModal from "../LoginFormModal/LoginFormModal";
import SignupFormModal from "../SignupFormModal/SignupFormModal";

import "./AuthModal.css"

export default function AuthModal() {
    const [mode, setMode] = useState("login"); // 'login' or 'signup'
    return (
        <div className="auth-modal-container">
          <div className="auth-header">
            <h1>{mode === "login" ? "Sign In" : "Sign Up"}</h1>
            <button
              className="auth-switch-button"
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
            >
              {mode === "login" ? "Register" : "Back to Login"}
            </button>
          </div>
          {mode === "login" ? <LoginFormModal embedded /> : <SignupFormModal embedded />}
        </div>
      );
    }
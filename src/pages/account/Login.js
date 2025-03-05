import React from "react";
import "../../styles/pages/account/Login.css";

const Login = () => {
  return (
    <div className="login-container">
      <h2>Login</h2>
      <form>
        <div className="input-group">
          <label>Email:</label>
          <input type="email" placeholder="Enter your email" />
        </div>
        <div className="input-group">
          <label>Password:</label>
          <input type="password" placeholder="Enter your password" />
        </div>
        <button type="submit" className="login-btn">Login</button>
      </form>
      <p>Don't have an account? <a href="/signup">Sign up</a></p>
    </div>
  );
};

export default Login;
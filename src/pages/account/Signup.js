import React from "react";
import "../../styles/pages/account/Signup.css";

const Signup = () => {
  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form>
        <div className="input-group">
          <label>Name:</label>
          <input type="text" placeholder="Enter your name" />
        </div>
        <div className="input-group">
          <label>Email:</label>
          <input type="email" placeholder="Enter your email" />
        </div>
        <div className="input-group">
          <label>Password:</label>
          <input type="password" placeholder="Create a password" />
        </div>
        <button type="submit" className="signup-btn">Sign Up</button>
      </form>
      <p>Already have an account? <a href="/login">Login</a></p>
    </div>
  );
};

export default Signup;
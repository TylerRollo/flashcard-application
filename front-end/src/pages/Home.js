// src/pages/Home.js
import React from "react";
import { Link } from "react-router-dom";
import "../styles/pages/Home.css"; // Importing CSS for styling

const Home = () => {
  return (
    <div className="home-container">
      <header className="hero">
        <h1>Welcome to FlashCard Learn</h1>
        <p>Your flashcard app for smarter learning FOR FREE!</p>
      </header>
      
      <section className="features">
        <div className="feature-card">
          <h2>📚 Study Smarter</h2>
          <p>Create and organize flashcards to enhance your learning process.</p>
        </div>
        <div className="feature-card">
          <h2>⚡ Quick & Easy</h2>
          <p>Flip through flashcards and test your knowledge with ease.</p>
        </div>
        <div className="feature-card">
          <h2>📊 Track Progress</h2>
          <p>Monitor your learning progress with built-in statistics.</p>
        </div>
        <div className="feature-card">
          <h2>💰 100% Free</h2>
          <p>Enjoy all features without any hidden costs. Learn without limits!</p>
        </div>
      </section>

      <footer className="cta">
        <p>Ready to start learning?</p>
        <Link to = "/signup">
          <button className="get-started">Get Started</button>
        </Link>
      </footer>
    </div>
  );
};

export default Home;

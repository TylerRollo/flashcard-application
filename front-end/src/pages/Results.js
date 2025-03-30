// src/pages/Results.js
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/pages/Results.css";

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { correct, incorrect, deckId, incorrectCards } = location.state || { correct: 0, incorrect: 0, deckId: null, incorrectCards: [] };

  const total = correct + incorrect;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
  const encouragement =
    percentage === 100 ? "Perfect score! Amazing job! 🎉" :
    percentage >= 75 ? "Great work! Keep it up! 💪" :
    percentage >= 50 ? "Good effort! Practice makes perfect! 👍" :
    "Don't give up! Try again and you'll get there! 🚀";

  return (
    <div className="results-container">
      <header className="results-hero">
        <h1>Study Results</h1>
        <p>{encouragement}</p>
      </header>

      <section className="results-summary">
        <h2>📊 Your Score</h2>
        <p><strong>Correct:</strong> {correct}</p>
        <p><strong>Incorrect:</strong> {incorrect}</p>
        <p><strong>Accuracy:</strong> {percentage}%</p>
      </section>

      {incorrectCards.length > 0 && (
        <section className="incorrect-answers">
          <h2>❌ Incorrect Answers</h2>
          <ul>
            {incorrectCards.map((card, index) => (
              <li key={index} className="incorrect-card">
                <p><strong>Q:</strong> {card.front}</p>
                <p><strong>A:</strong> {card.back}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <footer className="results-actions">
        <button className="retry-button" onClick={() => navigate(`/playgame/${deckId}`)}>
          🔄 Retry Deck
        </button>
        <button className="decks-button" onClick={() => navigate("/playgame")}>
          📚 Choose Another Deck
        </button>
      </footer>
    </div>
  );
};

export default Results;

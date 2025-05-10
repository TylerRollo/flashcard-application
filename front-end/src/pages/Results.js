import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import testModes from "../utils/testModes.js"; // Import available test modes
import "../styles/pages/Results.css"; // Import styles

const Results = () => {
  const navigate = useNavigate(); // Hook for navigation
  const location = useLocation(); // Hook to access state passed from previous screen

  // Destructure state values passed from the PlaygameDetails component
  const {
    correct = 0,                  // Number of correct answers
    incorrect = 0,                // Number of incorrect answers
    deckId = null,                // ID of the studied deck
    deckName = "",                // Name of the deck
    incorrectCards = [],         // Array of incorrectly answered cards
    testMode = testModes.FRONT_FIRST, // Mode used for testing (front first, back first, or random)
    showBack = false,            // Indicates which side to show first when retrying
    deck = null,                 // The full deck object
    flashcards = [],             // All flashcards in the deck
  } = location.state || {};

  // Calculate total answered and accuracy percentage
  const total = correct + incorrect;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

  // Generate a motivational message based on performance
  const encouragement =
    percentage === 100
      ? "Perfect score! Amazing job! 🎉"
      : percentage >= 75
      ? "Great work! Keep it up! 💪"
      : percentage >= 50
      ? "Good effort! Practice makes perfect! 👍"
      : "Don't give up! Try again and you'll get there! 🚀";

  // Allow user to download their incorrect answers as a JSON file
  const generateJSON = () => {
    const jsonData = incorrectCards.map((card) => ({
      front: card.front,
      back: card.back,
    }));

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
      type: "application/json;charset=utf-8;",
    });

    const link = document.createElement("a");
    const fileName = deckName || `deck_${deckId}`;

    // Create and auto-click download link
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `${fileName}_incorrect_answers.json`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="results-container">
      {/* Header section with result title and encouragement */}
      <header className="results-hero">
        <h1>Study Results</h1>
        <p>{encouragement}</p>
      </header>

      {/* Score summary section */}
      <section className="results-summary">
        <h2>📊 Your Score</h2>
        <p>
          <strong>Correct:</strong> {correct}
        </p>
        <p>
          <strong>Incorrect:</strong> {incorrect}
        </p>
        <p>
          <strong>Accuracy:</strong> {percentage}%
        </p>
      </section>

      {/* Display list of incorrect answers if any */}
      {incorrectCards.length > 0 && (
        <section className="incorrect-answers">
          <h2>❌ Incorrect Answers</h2>
          <ul>
            {incorrectCards.map((card, index) => (
              <li key={index} className="incorrect-card">
                <p>
                  <strong>Q:</strong> {card.front}
                </p>
                <p>
                  <strong>A:</strong> {card.back}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Footer with action buttons */}
      <footer className="results-actions">
        {/* Retry the same deck with the same mode */}
        <button
          className="retry-button"
          onClick={() =>
            navigate(`/playgame/${deckId}`, {
              state: {
                testMode: testMode,
                showBack: showBack,
                deck: deck,
                flashcards: flashcards,
              },
            })
          }
        >
          🔄 Retry Deck
        </button>

        {/* Go back to deck selection page */}
        <button className="decks-button" onClick={() => navigate("/playgame")}>
          📚 Choose Another Deck
        </button>

        {/* Download incorrect answers as JSON if any */}
        {incorrectCards.length > 0 && (
          <button className="download-csv-button" onClick={generateJSON}>
            📥 Download Incorrect Answers
          </button>
        )}
      </footer>
    </div>
  );
};

export default Results;

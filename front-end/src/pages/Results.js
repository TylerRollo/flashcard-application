// Importing React library to build the component
import React from "react";

// Importing React Router hooks for navigation and accessing passed state
import { useNavigate, useLocation } from "react-router-dom";

// Importing styles specific to the Results page
import "../styles/pages/Results.css";

// Defining the Results component
const Results = () => {
  // Hook to programmatically navigate between routes
  const navigate = useNavigate();

  // Hook to access route-specific data (state passed via navigation)
  const location = useLocation();

  // Destructure values passed through route state or assign defaults
  const { correct, incorrect, deckId, deckName, incorrectCards, showBack } =
    location.state || {
      correct: 0,
      incorrect: 0,
      deckId: null,
      deckName: "",
      incorrectCards: [],
      showBack: false
    };

  // Calculate total questions and percentage of correct answers
  const total = correct + incorrect;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

  // Set motivational message based on performance
  const encouragement =
    percentage === 100
      ? "Perfect score! Amazing job! 🎉"
      : percentage >= 75
      ? "Great work! Keep it up! 💪"
      : percentage >= 50
      ? "Good effort! Practice makes perfect! 👍"
      : "Don't give up! Try again and you'll get there! 🚀";

  // Function to generate and trigger download of a JSON file containing incorrect answers
  const generateJSON = () => {
    // Format the incorrect cards as an array of objects
    const jsonData = incorrectCards.map(card => ({
      front: card.front,
      back: card.back
    }));

    // Convert to JSON string with indentation for readability
    const jsonString = JSON.stringify(jsonData, null, 2);

    // Create a Blob object with the JSON string
    const blob = new Blob([jsonString], {
      type: "application/json;charset=utf-8;"
    });

    // Create a link to trigger download of the file
    const link = document.createElement("a");
    const fileName = deckName || `deck_${deckId}`; // Fallback to deckId if deckName is missing

    // Only proceed if browser supports the download attribute
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `${fileName}_incorrect_answers.json`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click(); // Trigger the download
      document.body.removeChild(link); // Clean up the DOM
    }
  };

  // JSX returned by the component
  return (
    <div className="results-container">
      {/* Hero section with heading and motivational message */}
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

      {/* List of incorrect answers (if any) */}
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

      {/* Action buttons: retry, choose another deck, download JSON */}
      <footer className="results-actions">
        <button
          className="retry-button"
          onClick={() =>
            navigate(`/playgame/${deckId}`, {
              state: { frontFirst: showBack } // Reuse the same order the user studied in
            })
          }
        >
          🔄 Retry Deck
        </button>
        <button className="decks-button" onClick={() => navigate("/playgame")}>
          📚 Choose Another Deck
        </button>
        {incorrectCards.length > 0 && (
          <button className="download-csv-button" onClick={generateJSON}>
            📥 Download Incorrect Answers
          </button>
        )}
      </footer>
    </div>
  );
};

// Export the component as default for use in the app
export default Results;

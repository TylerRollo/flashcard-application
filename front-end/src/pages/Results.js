import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/pages/Results.css";

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { correct, incorrect, deckId, deckName, incorrectCards, showBack } = location.state || { correct: 0, incorrect: 0, deckId: null, deckName: "", incorrectCards: [], showBack: false };

  const total = correct + incorrect;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
  const encouragement =
    percentage === 100 ? "Perfect score! Amazing job! 🎉" :
    percentage >= 75 ? "Great work! Keep it up! 💪" :
    percentage >= 50 ? "Good effort! Practice makes perfect! 👍" :
    "Don't give up! Try again and you'll get there! 🚀";

  // Function to generate the CSV file for incorrect answers
  const generateJSON = () => {
    // Format the incorrect cards as an array of objects
    const jsonData = incorrectCards.map(card => ({
        front: card.front,
        back: card.back
    }));

    // Convert to JSON string with indentation for readability
    const jsonString = JSON.stringify(jsonData, null, 2);

    // Create a Blob with JSON content
    const blob = new Blob([jsonString], { type: "application/json;charset=utf-8;" });

    // Create a link to trigger the download
    const link = document.createElement("a");
    const fileName = deckName || `deck_${deckId}`; // Default to deck name or deckId
    if (link.download !== undefined) { // Feature detection for browsers that support download attribute
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
        <button className="retry-button" onClick={() => navigate(`/playgame/${deckId}`, { state: { frontFirst: showBack } })}>
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

export default Results;

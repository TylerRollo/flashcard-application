import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/pages/Results.css";

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { correct, incorrect, deckId, deckName, incorrectCards } = location.state || { correct: 0, incorrect: 0, deckId: null, deckName: "", incorrectCards: [] };

  const total = correct + incorrect;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
  const encouragement =
    percentage === 100 ? "Perfect score! Amazing job! 🎉" :
    percentage >= 75 ? "Great work! Keep it up! 💪" :
    percentage >= 50 ? "Good effort! Practice makes perfect! 👍" :
    "Don't give up! Try again and you'll get there! 🚀";

  // Function to generate the CSV file for incorrect answers
  const generateCSV = () => {
    // Define CSV header
    const header = ["Front", "Back"];
    
    // Combine the header and incorrect cards data
    const rows = incorrectCards.map(card => [card.front, card.back]);

    // Combine header and rows
    const csvContent = [
      header.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    // Create a blob with the CSV content
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    // Create a link to trigger the download
    const link = document.createElement("a");
    const fileName = deckName || `deck_${deckId}`; // Default to deck name or deckId
    if (link.download !== undefined) { // Feature detection for browsers that support download attribute
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `${fileName}_incorrect_answers.csv`);
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
        <button className="retry-button" onClick={() => navigate(`/playgame/${deckId}`)}>
          🔄 Retry Deck
        </button>
        <button className="decks-button" onClick={() => navigate("/playgame")}>
          📚 Choose Another Deck
        </button>
        {incorrectCards.length > 0 && (
          <button className="download-csv-button" onClick={generateCSV}>
            📥 Download Incorrect Answers
          </button>
        )}
      </footer>
    </div>
  );
};

export default Results;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Hook for programmatic navigation
import testModes from "../utils/testModes"; // Importing test mode constants
import "../styles/pages/Decks.css"; // Importing CSS for styling

// Functional component for selecting a deck and test mode
const Playgame = () => {
  const [decks, setDecks] = useState([]); // Stores list of decks from backend
  const [testMode, setTestMode] = useState(testModes.FRONT_FIRST); // Default test mode
  const navigate = useNavigate(); // Navigation function from react-router-dom

  // Fetch decks from API on component mount
  useEffect(() => {
    fetchDecks();
  }, []);

  // Async function to get deck data from the backend
  const fetchDecks = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/decks");
      const data = await response.json();
      setDecks(data); // Update state with retrieved decks
    } catch (error) {
      console.error("Error fetching decks:", error);
    }
  };
  
  // Handle when a user selects a deck
  const handleDeckClick = (deckId) => {
    // Navigate to the game screen with selected deck and test mode
    navigate(`/playgame/${deckId}`, { state: { testMode } });
    console.log("navigating to deck:", deckId, "With test mode:", testMode);
  };

  // Update test mode state when user clicks a mode button
  const handleTestModeChange = (mode) => {
    setTestMode(mode);
  };

  return (
    <div className="decks-container">
      {/* Section for selecting a test mode */}
      <header>
        <ul>
          <button
            className={`test-button ${testMode === 'front-first' ? 'active' : ''}`}
            onClick={() => handleTestModeChange(testModes.FRONT_FIRST)}
          >
            Show: Front | Back
          </button>
          <button
            className={`test-button ${testMode === 'back-first' ? 'active' : ''}`}
            onClick={() => handleTestModeChange(testModes.BACK_FIRST)}
          >
            Show: Back | Front
          </button>
          <button
            className={`test-button ${testMode === 'random' ? 'active' : ''}`}
            onClick={() => handleTestModeChange(testModes.RANDOM)}
          >
            Randomize Front or Back
          </button>
        </ul>
      </header>

      {/* Page title */}
      <header className="decks-header">
        <h1>Choose Your Study Deck</h1>
      </header>

      {/* Section that displays available decks */}
      <section className="deck-list">
        {decks.map((deck) => (
          <div
            key={deck.id}
            className="deck-item"
            onClick={() => handleDeckClick(deck.id)} // Navigate on click
          >
            <h2>{deck.name}</h2>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Playgame; // Export component for use in routing

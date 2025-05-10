import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import testModes from "../utils/testModes";
import "../styles/pages/Decks.css";

const Playgame = () => {
  const [decks, setDecks] = useState([]);
  const [testMode, setTestMode] = useState(testModes.FRONT_FIRST);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDecks();
  }, []);

  const fetchDecks = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/decks");
      const data = await response.json();
      setDecks(data);
    } catch (error) {
      console.error("Error fetching decks:", error);
    }
  };
  
  const handleDeckClick = (deckId) => {
    navigate(`/playgame/${deckId}`, { state: { testMode } });
    console.log("navigating to deck:", deckId, "With test mode:", testMode);
  };

  const handleTestModeChange = (mode) => {
    setTestMode(mode);
  };

  return (
    <div className="decks-container">
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

      <header className="decks-header">
        <h1>Choose Your Study Deck</h1>
      </header>

      <section className="deck-list">
        {decks.map((deck) => (
          <div
            key={deck.id}
            className="deck-item"
            onClick={() => handleDeckClick(deck.id)}
          >
            <h2>{deck.name}</h2>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Playgame;

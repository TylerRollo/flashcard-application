import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/pages/Decks.css";

const Playgame = () => {
  const [decks, setDecks] = useState([]);
  const [frontFirst, setFrontFirst] = useState(true); // Default to true
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

  const toggleFrontFirst = () => {
    setFrontFirst((prev) => {
      console.log("Toggling frontFirst:", !prev);
      return !prev;
    });
  };

  const handleDeckClick = (deckId) => {
    console.log(frontFirst);
    navigate(`/playgame/${deckId}`, { state: { frontFirst } });
  };

  return (
    <div className="decks-container">
      <header>
        <button className="front-first-button" onClick={toggleFrontFirst}>
          {frontFirst ? "Showing the Question First" : "Showing the Answer First"}
        </button>
      </header>
      <header className="decks-header">
        <h1>Choose Your Study Deck</h1>
      </header>
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

export default Playgame;

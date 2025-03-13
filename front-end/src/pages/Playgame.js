// src/pages/Decks.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/pages/Decks.css";

const Playgame = () => {
  const [decks, setDecks] = useState([]);

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

  return (
      <div className="decks-container">
        <header className="decks-header">
          <h1>Choose your Deck</h1>
        </header>
  
        <section className="deck-list">
          {decks.map((deck) => (
            <div key={deck.id} className="deck-item">
              <Link to={`/playgame/${deck.id}`}>
                <h2>{deck.name}</h2>
              </Link>
            </div>
          ))}
        </section>
      </div>
    );
};

export default Playgame;

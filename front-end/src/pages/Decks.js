// src/pages/Decks.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/pages/Decks.css";

const Decks = () => {
  const [decks, setDecks] = useState([]);
  const [newDeckName, setNewDeckName] = useState("");
  const userId = 1; // 🔹 Hardcoded user ID (Replace with actual user authentication system)

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

  const addDeck = async () => {
    if (!newDeckName) return alert("Deck name is required.");
    
    try {
      const response = await fetch("http://localhost:5000/api/decks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, name: newDeckName }), // 🔹 Include user_id
      });

      if (response.ok) {
        setNewDeckName("");
        fetchDecks();
      } else {
        const errorData = await response.json();
        console.error("Error adding deck:", errorData);
        alert(errorData.error || "Failed to add deck.");
      }
    } catch (error) {
      console.error("Error adding deck:", error);
    }
  };

  const deleteDeck = async (deckId) => {
    try {
      await fetch(`http://localhost:5000/api/decks/${deckId}`, { method: "DELETE" });
      fetchDecks();
    } catch (error) {
      console.error("Error deleting deck:", error);
    }
  };

  return (
    <div className="decks-container">
      <header className="decks-header">
        <h1>My Decks</h1>
      </header>

      <section className="deck-form">
        <input
          type="text"
          placeholder="New Deck Name"
          value={newDeckName}
          onChange={(e) => setNewDeckName(e.target.value)}
        />
        <button onClick={addDeck}>Create Deck</button>
      </section>

      <section className="deck-list">
        {decks.map((deck) => (
          <div key={deck.id} className="deck-item">
            <Link to={`/decks/${deck.id}`}>
              <h2>{deck.name}</h2>
            </Link>
            <button onClick={() => deleteDeck(deck.id)}>Delete</button>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Decks;

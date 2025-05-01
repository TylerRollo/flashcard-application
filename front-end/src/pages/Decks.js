// src/pages/Decks.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/pages/Decks.css";

const Decks = () => {
  const [decks, setDecks] = useState([]);
  const [newDeckName, setNewDeckName] = useState("");
  const [editingDeckId, setEditingDeckId] = useState(null);
  const [editedDeckName, setEditedDeckName] = useState("");
  const userId = 1; // Hardcoded user ID currently, TODO: Replace with actual user authentication system

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
    const confirmDelete = window.confirm("Are you sure you want to delete this deck?");
    if (!confirmDelete) return;

    try {
      await fetch(`http://localhost:5000/api/decks/${deckId}`, { method: "DELETE" });
      fetchDecks();
    } catch (error) {
      console.error("Error deleting deck:", error);
    }
  };

  const startEditing = (deckId, currentName) => {
    setEditingDeckId(deckId);
    setEditedDeckName(currentName);
  };

  const cancelEditing = () => {
    setEditingDeckId(null);
    setEditedDeckName("");
  };

  const updateDeckName = async (deckId) => {
    if (!editedDeckName.trim()) {
      alert("Deck name cannot be empty.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/decks/${deckId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editedDeckName }),
      });

      if (response.ok) {
        setEditingDeckId(null);
        fetchDecks();
      } else {
        const errorData = await response.json();
        console.error("Error updating deck name:", errorData);
        alert(errorData.error || "Failed to update deck.");
      }
    } catch (error) {
      console.error("Error updating deck name:", error);
    }
  };

  return (
    <div className="decks-container">
      <header className="decks-header">
        <h1>My Decks</h1>
      </header>

      <section className="deck-form">
        <h1>Create New Deck</h1>
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
            {editingDeckId === deck.id ? (
              <div className="edit-mode">
                <textarea
                  rows="4"
                  cols="35"
                  type="text"
                  value={editedDeckName}
                  onChange={(e) => setEditedDeckName(e.target.value)}
                />
                <br></br>
                <button onClick={() => updateDeckName(deck.id)}>Save</button>
                <button onClick={cancelEditing}>Cancel</button>
              </div>
            ) : (
              <>
                <Link to={`/decks/${deck.id}`}>
                  <h2>{deck.name}</h2>
                </Link>
                <button onClick={() => startEditing(deck.id, deck.name)}>Edit Name</button>
                <button onClick={() => deleteDeck(deck.id)}>Delete</button>
              </>
            )}
          </div>
        ))}
      </section>
    </div>
  );
};

export default Decks;

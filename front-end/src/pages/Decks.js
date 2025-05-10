// src/pages/Decks.js

import React, { useEffect, useState } from "react";
import constants from "../utils/constants";
import { Link } from "react-router-dom";
import "../styles/pages/Decks.css";

const Decks = () => {
  const [decks, setDecks] = useState([]);
  const [newDeckName, setNewDeckName] = useState("");
  const [editingDeckId, setEditingDeckId] = useState(null);
  const [editedDeckName, setEditedDeckName] = useState("");
  const [selectedDecks, setSelectedDecks] = useState([]);

  const userId = 1;

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

    if (newDeckName.length > constants.MAX_DECK_NAME_LENGTH) {
      return alert(`Deck name cannot exceed ${constants.MAX_DECK_NAME_LENGTH} characters.`);
    }

    try {
      const response = await fetch("http://localhost:5000/api/decks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, name: newDeckName }),
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

  const deleteSelectedDecks = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete the selected decks?");
    if (!confirmDelete) return;

    try {
      await Promise.all(
        selectedDecks.map(deckId =>
          fetch(`http://localhost:5000/api/decks/${deckId}`, { method: "DELETE" })
        )
      );
      setSelectedDecks([]);
      fetchDecks();
    } catch (error) {
      console.error("Error deleting decks:", error);
    }
  };

  const toggleDeckSelection = (deckId) => {
    setSelectedDecks(prev =>
      prev.includes(deckId) ? prev.filter(id => id !== deckId) : [...prev, deckId]
    );
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

    if (editedDeckName.length > constants.MAX_DECK_NAME_LENGTH) {
      return alert(`Deck name cannot exceed ${constants.MAX_DECK_NAME_LENGTH} characters.`);
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

      {selectedDecks.length > 0 && (
        <div className="bulk-delete-bar">
          <button className="bulk-delete-btn" onClick={deleteSelectedDecks}>
            Delete Selected ({selectedDecks.length})
          </button>
        </div>
      )}

      <section className="deck-list">
        {decks.map((deck) => (
          <div key={deck.id} className="deck-item">
            <div className="deck-top">
              <input
                type="checkbox"
                className="deck-checkbox"
                checked={selectedDecks.includes(deck.id)}
                onChange={() => toggleDeckSelection(deck.id)}
              />
            </div>

            {editingDeckId === deck.id ? (
              <div className="edit-mode">
                <textarea
                  rows="4"
                  cols="35"
                  type="text"
                  value={editedDeckName}
                  onChange={(e) => setEditedDeckName(e.target.value)}
                />
                <br />
                <button onClick={() => updateDeckName(deck.id)}>Save</button>
                <button onClick={cancelEditing}>Cancel</button>
              </div>
            ) : (
              <>
                <Link to={`/decks/${deck.id}`}>
                  <h2>{deck.name}</h2>
                </Link>
                <button onClick={() => startEditing(deck.id, deck.name)}>Edit Name</button>
              </>
            )}
          </div>
        ))}
      </section>
    </div>
  );
};

export default Decks;

// src/pages/Decks.js

import React, { useEffect, useState } from "react";
import constants from "../utils/constants";
import { Link } from "react-router-dom";
import "../styles/pages/Decks.css";
import { toast } from "react-toastify";

const Decks = () => {
  // State for storing all user decks
  const [decks, setDecks] = useState([]);

  // State for handling new deck creation
  const [newDeckName, setNewDeckName] = useState("");

  // State for editing a deck
  const [editingDeckId, setEditingDeckId] = useState(null);
  const [editedDeckName, setEditedDeckName] = useState("");

  // State for handling multiple selected decks for bulk actions
  const [selectedDecks, setSelectedDecks] = useState([]);

  // Currently hardcoded user ID
  const userId = 1;

  // Fetch decks on component mount
  useEffect(() => {
    fetchDecks();
  }, []);

  // Fetch all decks from the backend
  const fetchDecks = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/decks");
      const data = await response.json();
      setDecks(data);
    } catch (error) {
      console.error("Error fetching decks:", error);
    }
  };

  // Add a new deck with validation
  const addDeck = async () => {
    if (!newDeckName) {
      toast.warning("Deck name is required.");
      return;
    }

    if (newDeckName.length > constants.MAX_DECK_NAME_LENGTH) {
      toast.warning(`Deck name cannot exceed ${constants.MAX_DECK_NAME_LENGTH} characters.`);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/decks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, name: newDeckName }),
      });

      if (response.ok) {
        setNewDeckName("");
        fetchDecks(); // Refresh deck list
        toast.success("Deck added successfully!");
      } else {
        const errorData = await response.json();
        console.error("Error adding deck:", errorData);
        toast.error(errorData.error || "Failed to add deck.");
      }
    } catch (error) {
      console.error("Error adding deck:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  // Delete selected decks after user confirmation
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
      fetchDecks(); // Refresh deck list
    } catch (error) {
      console.error("Error deleting decks:", error);
    }
  };

  // Toggle deck selection for bulk delete
  const toggleDeckSelection = (deckId) => {
    setSelectedDecks(prev =>
      prev.includes(deckId) ? prev.filter(id => id !== deckId) : [...prev, deckId]
    );
  };

  // Enable edit mode for a specific deck
  const startEditing = (deckId, currentName) => {
    setEditingDeckId(deckId);
    setEditedDeckName(currentName);
  };

  // Cancel editing mode
  const cancelEditing = () => {
    setEditingDeckId(null);
    setEditedDeckName("");
  };

  // Update the name of a deck with validation
  const updateDeckName = async (deckId) => {
    if (!editedDeckName.trim()) {
      toast.warning("Deck name cannot be empty.");
      return;
    }

    if (editedDeckName.length > constants.MAX_DECK_NAME_LENGTH) {
      toast.warning(`Deck name cannot exceed ${constants.MAX_DECK_NAME_LENGTH} characters.`);
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
        fetchDecks(); // Refresh deck list
        toast.success("Deck name updated successfully!");
      } else {
        const errorData = await response.json();
        console.error("Error updating deck name:", errorData);
        toast.error(errorData.error || "Failed to update deck.");
      }
    } catch (error) {
      console.error("Error updating deck name:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <div className="decks-container">
      {/* Header section */}
      <header className="decks-header">
        <h1>My Decks</h1>
      </header>

      {/* New deck creation form */}
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

      {/* Bulk delete action bar */}
      {selectedDecks.length > 0 && (
        <div className="bulk-delete-bar">
          <button className="bulk-delete-btn" onClick={deleteSelectedDecks}>
            Delete Selected ({selectedDecks.length})
          </button>
        </div>
      )}

      {/* List of user decks */}
      <section className="deck-list">
        {decks.map((deck) => (
          <div key={deck.id} className="deck-item">
            <div className="deck-top">
              {/* Checkbox for selecting decks */}
              <input
                type="checkbox"
                className="deck-checkbox"
                checked={selectedDecks.includes(deck.id)}
                onChange={() => toggleDeckSelection(deck.id)}
              />
            </div>

            {/* Edit mode view */}
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
                {/* Deck name and navigation */}
                <Link to={`/decks/${deck.id}`}>
                  <h2>{deck.name}</h2>
                </Link>
                {/* Enable edit mode */}
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

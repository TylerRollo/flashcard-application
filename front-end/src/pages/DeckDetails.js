// Import necessary React modules and hooks
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "../styles/pages/DeckDetails.css"; // Import component-specific styling

// Component for displaying and managing a deck and its flashcards
const DeckDetails = () => {
  const { id } = useParams(); // Get deck ID from route parameters
  const [deck, setDeck] = useState(null); // Store deck information
  const [flashcards, setFlashcards] = useState([]); // Store list of flashcards
  const [newCard, setNewCard] = useState({ deck_id: Number(id), front: '', back: '' }); // New flashcard form data
  const [editingCard, setEditingCard] = useState(null); // Track the ID of the flashcard being edited

  // Fetch deck and flashcard data when component mounts or ID changes
  useEffect(() => {
    fetchDeckDetails();
  }, [id]);

  // Function to fetch deck and its flashcards from the backend
  const fetchDeckDetails = async () => {
    try {
      // Fetch deck info
      const deckResponse = await fetch(`http://localhost:5000/api/decks/${id}`);
      if (!deckResponse.ok) throw new Error(`Error fetching deck: ${deckResponse.status}`);
      const deckData = await deckResponse.json();
      setDeck(deckData);

      // Fetch flashcards for the deck
      const flashcardsResponse = await fetch(`http://localhost:5000/api/flashcards/${id}`);
      if (!flashcardsResponse.ok) throw new Error(`Error fetching flashcards: ${flashcardsResponse.status}`);
      const flashcardData = await flashcardsResponse.json();
      setFlashcards(flashcardData);
    } catch (error) {
      console.error('Error fetching deck details:', error);
    }
  };

  // Function to add a new flashcard to the current deck
  const addFlashcard = async () => {
    if (!newCard.front || !newCard.back) {
      alert('All fields are required.');
      return;
    }
    try {
      await fetch(`http://localhost:5000/api/flashcards/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCard),
      });
      // Clear form after successful addition
      setNewCard({ deck_id: Number(id), front: '', back: '' });
      fetchDeckDetails(); // Refresh deck data
    } catch (error) {
      console.error('Error adding flashcard:', error);
    }
  };

  // Function to delete a flashcard by ID
  const deleteFlashcard = async (cardId) => {
    if (!window.confirm("Are you sure you want to delete this flashcard?")) return;
    try {
      await fetch(`http://localhost:5000/api/flashcards/${cardId}`, { method: 'DELETE' });
      fetchDeckDetails(); // Refresh list after deletion
    } catch (error) {
      console.error('Error deleting flashcard:', error);
    }
  };

  // Function to update a flashcard's data
  const updateFlashcard = async (cardId, updatedCard) => {
    try {
      await fetch(`http://localhost:5000/api/flashcards/${cardId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCard),
      });
      setEditingCard(null); // Exit editing mode
      fetchDeckDetails(); // Refresh updated data
    } catch (error) {
      console.error('Error updating flashcard:', error);
    }
  };

  // Generate downloadable JSON file of flashcards
  const generateJSON = () => {
    if (!flashcards || flashcards.length === 0) {
      alert("No flashcards to export.");
      return;
    }

    // Map flashcards to export structure
    const jsonData = flashcards.map(card => ({
      front: card.front,
      back: card.back
    }));

    const jsonString = JSON.stringify(jsonData, null, 2); // Pretty print
    const blob = new Blob([jsonString], { type: "application/json;charset=utf-8;" });
    const link = document.createElement("a");
    const fileName = deck?.name || `deck_${id}`;

    // Create download link and auto-trigger download
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `${fileName}_incorrect_answers.json`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Component render
  return (
    <div className="deck-details-container">
      <header className="deck-header">
        <div className="deck-header-top">
          <h1>{deck ? deck.name : 'Loading...'}</h1>
          <button className="download-button" onClick={generateJSON}>
            Download Deck
          </button>
        </div>
      </header>

      {/* Form for adding new flashcards */}
      <section className="flashcard-form">
        <input
          type="text"
          placeholder="Question"
          value={newCard.front}
          onChange={(e) => setNewCard({ ...newCard, front: e.target.value })}
        />
        <input
          type="text"
          placeholder="Answer"
          value={newCard.back}
          onChange={(e) => setNewCard({ ...newCard, back: e.target.value })}
        />
        <button onClick={addFlashcard}>Add Flashcard</button>
      </section>

      {/* List of flashcards with edit and delete options */}
      <section className="flashcard-list">
        {flashcards.map((card, index) => (
          <div key={card.id} className="flashcard-item">
            <div className="flashcard-number">{index + 1}</div>
            {editingCard === card.id ? (
              <>
                {/* Editable fields for updating a flashcard */}
                <textarea
                  rows="1"
                  cols="35"
                  value={card.front}
                  onChange={(e) => setFlashcards(
                    flashcards.map(c => c.id === card.id ? { ...c, front: e.target.value } : c))}
                />
                <textarea
                  rows="8"
                  cols="35"
                  value={card.back}
                  onChange={(e) => setFlashcards(
                    flashcards.map(c => c.id === card.id ? { ...c, back: e.target.value } : c))}
                />
                <br />
                <button onClick={() => updateFlashcard(card.id, card)}>Save</button>
              </>
            ) : (
              <>
                {/* Display flashcard content */}
                <p><strong>Q:</strong> {card.front}</p>
                <p><strong>A:</strong> {card.back}</p>
                <button onClick={() => setEditingCard(card.id)}>Edit</button>
                <button onClick={() => deleteFlashcard(card.id)}>Delete</button>
              </>
            )}
          </div>
        ))}
      </section>
    </div>
  );
};

export default DeckDetails;

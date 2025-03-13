// src/pages/DeckDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "../styles/pages/DeckDetails.css";

const DeckDetails = () => {
  const { id } = useParams();  // Get the deck ID from the URL params
  const [deck, setDeck] = useState(null);  // Store the deck data
  const [flashcards, setFlashcards] = useState([]);  // Store the flashcards for the deck
  const [newCard, setNewCard] = useState({ deck_id: id, front: '', back: '' });  // State for the new flashcard

  // Fetch the deck details when the component mounts or when the ID changes
  useEffect(() => {
    fetchDeckDetails();
  }, [id]);

  const fetchDeckDetails = async () => {
    try {
      // Fetch deck details
      const deck_response = await fetch(`http://localhost:5000/api/decks/${id}`);
      if (!deck_response.ok) throw new Error(`Error fetching deck: ${deck_response.status}`);
      const deck_data = await deck_response.json();
      setDeck(deck_data);  // Set the deck data
      
      const flashcards_response = await fetch(`http://localhost:5000/api/flashcards/${id}`);
      if (!flashcards_response.ok) throw new Error(`Error fetching deck: ${flashcards_response.status}`);
      const flashcard_data = await flashcards_response.json();
      setFlashcards(flashcard_data);  // Set the deck data

    } catch (error) {
      console.error('Error fetching deck details:', error);
    }
  };

  const addFlashcard = async () => {
    // Ensure both the front and back fields are filled before adding a flashcard
    if (!newCard.front || !newCard.back) {
      alert('All fields are required.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/flashcards/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deck_id: newCard.deck_id, front: newCard.front, back: newCard.back }),
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      setNewCard({ front: '', back: '' });  // Reset the form
      fetchDeckDetails();  // Refresh the flashcards list
    } catch (error) {
      console.error('Error adding flashcard:', error);
    }
  };

  const deleteFlashcard = async (cardId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/flashcards/${cardId}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  
      fetchDeckDetails();  // Refresh the flashcards list after deletion
    } catch (error) {
      console.error('Error deleting flashcard:', error);
    }
  };
  

  return (
    <div className="deck-details-container">
      <header className="deck-header">
        <h1>{deck ? deck.name : 'Loading...'}</h1>
      </header>

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

      <section className="flashcard-list">
        {flashcards.map((card) => (
          <div key={card.id} className="flashcard-item">
            <p><strong>Q:</strong> {card.front}</p>
            <p><strong>A:</strong> {card.back}</p>
            <button onClick={() => deleteFlashcard(card.id)}>Delete</button>
          </div>
        ))}
      </section>

    </div>
  );
};

export default DeckDetails;

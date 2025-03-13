// src/pages/DeckDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "../styles/pages/DeckDetails.css";

const DeckDetails = () => {
  const { id } = useParams();
  const [deck, setDeck] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [newCard, setNewCard] = useState({ deck_id: id, front: '', back: '' });

  useEffect(() => {
    fetchDeckDetails();
  }, [id]);

  const fetchDeckDetails = async () => {
    try {
      const deck_response = await fetch(`http://localhost:5000/api/decks/${id}`);
      if (!deck_response.ok) throw new Error(`Error fetching deck: ${deck_response.status}`);
      const deck_data = await deck_response.json();
      setDeck(deck_data);

      const flashcards_response = await fetch(`http://localhost:5000/api/flashcards/${id}`);
      if (!flashcards_response.ok) throw new Error(`Error fetching flashcards: ${flashcards_response.status}`);
      const flashcard_data = await flashcards_response.json();
      setFlashcards(flashcard_data);
    } catch (error) {
      console.error('Error fetching deck details:', error);
    }
  };

  const addFlashcard = async () => {
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

      setNewCard({ front: '', back: '' });
      fetchDeckDetails();
    } catch (error) {
      console.error('Error adding flashcard:', error);
    }
  };

  const deleteFlashcard = async (cardId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this flashcard?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/api/flashcards/${cardId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      fetchDeckDetails();
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

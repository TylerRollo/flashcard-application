// src/pages/DeckDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "../styles/pages/DeckDetails.css";

const DeckDetails = () => {
  const { id } = useParams();
  const [deck, setDeck] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [newCard, setNewCard] = useState({ deck_id: Number(id), front: '', back: '' });
  const [editingCard, setEditingCard] = useState(null);
  
  useEffect(() => {
    fetchDeckDetails();
  }, [id]);

  const fetchDeckDetails = async () => {
    try {
      const deckResponse = await fetch(`http://localhost:5000/api/decks/${id}`);
      if (!deckResponse.ok) throw new Error(`Error fetching deck: ${deckResponse.status}`);
      const deckData = await deckResponse.json();
      setDeck(deckData);

      const flashcardsResponse = await fetch(`http://localhost:5000/api/flashcards/${id}`);
      if (!flashcardsResponse.ok) throw new Error(`Error fetching flashcards: ${flashcardsResponse.status}`);
      const flashcardData = await flashcardsResponse.json();
      setFlashcards(flashcardData);
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
      await fetch(`http://localhost:5000/api/flashcards/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCard),
      });
      setNewCard({ deck_id: Number(id), front: '', back: '' });
      fetchDeckDetails();
    } catch (error) {
      console.error('Error adding flashcard:', error);
    }
  };

  const deleteFlashcard = async (cardId) => {
    if (!window.confirm("Are you sure you want to delete this flashcard?")) return;
    try {
      await fetch(`http://localhost:5000/api/flashcards/${cardId}`, { method: 'DELETE' });
      fetchDeckDetails();
    } catch (error) {
      console.error('Error deleting flashcard:', error);
    }
  };

  const updateFlashcard = async (cardId, updatedCard) => {
    try {
      await fetch(`http://localhost:5000/api/flashcards/${cardId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCard),
      });
      setEditingCard(null);
      fetchDeckDetails();
    } catch (error) {
      console.error('Error updating flashcard:', error);
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
            {editingCard === card.id ? (
              <>
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
                <br></br>
                <button onClick={() => updateFlashcard(card.id, card)}>Save</button>
              </>
            ) : (
              <>
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

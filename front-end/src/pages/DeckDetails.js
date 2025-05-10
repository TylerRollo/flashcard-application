// Import necessary React modules and hooks
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import constants from '../utils/constants';
import "../styles/pages/DeckDetails.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// Component for displaying and managing a deck and its flashcards
const DeckDetails = () => {
  const { id } = useParams();
  const [deck, setDeck] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [newCard, setNewCard] = useState({ deck_id: Number(id), front: '', back: '' });
  const [editingCard, setEditingCard] = useState(null);
  const [selectedCards, setSelectedCards] = useState(new Set());

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
      toast.error('All fields are required.');
      return;
    }
  
    if (
      constants.MAX_FLASHCARD_NAME_LENGTH < newCard.front.length ||
      constants.MAX_FLASHCARD_NAME_LENGTH < newCard.back.length
    ) {
      console.log("front", newCard.front.length, "back", newCard.back.length);
      toast.error(`Question or Answer cannot exceed ${constants.MAX_FLASHCARD_NAME_LENGTH} characters.`);
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
      toast.success('Flashcard added successfully!');
    } catch (error) {
      console.error('Error adding flashcard:', error);
      toast.error('Error adding flashcard. Please try again.');
    }
  };

  const deleteSelectedFlashcards = async () => {
    if (!window.confirm("Are you sure you want to delete the selected flashcards?")) return;
    try {
      await Promise.all(Array.from(selectedCards).map(cardId =>
        fetch(`http://localhost:5000/api/flashcards/${cardId}`, { method: 'DELETE' })
      ));
      setSelectedCards(new Set());
      fetchDeckDetails();
    } catch (error) {
      console.error('Error deleting flashcards:', error);
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

  const generateJSON = () => {
    if (!flashcards || flashcards.length === 0) {
      toast.warning("No flashcards to export.");
      return;
    }
  
    const jsonData = flashcards.map(card => ({ front: card.front, back: card.back }));
    const jsonString = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json;charset=utf-8;" });
    const link = document.createElement("a");
    const fileName = deck?.name || `deck_${id}`;
  
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `${fileName}_incorrect_answers.json`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      toast.success("Flashcards exported successfully!");
    }
  };

  const toggleSelectCard = (cardId) => {
    setSelectedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) newSet.delete(cardId);
      else newSet.add(cardId);
      return newSet;
    });
  };

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
        {selectedCards.size > 0 && (
            <button className="delete-button" onClick={deleteSelectedFlashcards}>
              Delete Selected
            </button>
          )}
      </section>

      <section className="flashcard-list">
        {flashcards.map((card, index) => (
          <div key={card.id} className="flashcard-item">
            <div className="flashcard-number">{index + 1}</div>
            <input
              type="checkbox"
              className="select-checkbox"
              checked={selectedCards.has(card.id)}
              onChange={() => toggleSelectCard(card.id)}
            />
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
                <div className="flashcard-buttons">
                  <button onClick={() => updateFlashcard(card.id, card)}>Save</button>
                </div>
              </>
            ) : (
              <>
                <p><strong>Q:</strong> {card.front}</p>
                <p><strong>A:</strong> {card.back}</p>
                <div className="flashcard-buttons">
                  <button onClick={() => setEditingCard(card.id)}>Edit</button>
                </div>
              </>
            )}
          </div>
        ))}
      </section>

    </div>
  );
};

export default DeckDetails;
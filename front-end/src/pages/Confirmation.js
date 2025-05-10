import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import "../styles/pages/Confirmation.css"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import testModes from '../utils/testModes';

const Confirmation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [deck, setDeck] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [selectedCards, setSelectedCards] = useState(new Set());
  const testMode = location.state.testMode || testModes.FRONT_FIRST;

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
      toast.error('Error fetching deck details');
      console.error(error);
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

  const handleSelectAll = () => {
    if (selectedCards.size === flashcards.length) {
      setSelectedCards(new Set());
    } else {
      setSelectedCards(new Set(flashcards.map(card => card.id)));
    }
  };

  const handleStartGame = () => {
    if (selectedCards.size === 0) {
      toast.warning("Please select at least one card to start the game.");
      return;
    }

    // Pass selected card IDs or data via state (or use global store)
    const selectedFlashcards = flashcards.filter(card => selectedCards.has(card.id));
    console.log("Selected Flashcards:", selectedFlashcards, "Selected Deck ID:", id);
    navigate(`/playgame/${id}`, {
        state: { 
            flashcards: selectedFlashcards ,
            testMode: testMode,
            deck: deck
        } 
    });
  };

  return (
    <div className="deck-details-container">
      <header className="deck-header">
        <div className="deck-header-top">
          <h1>{deck ? deck.name : 'Loading...'}</h1>
        </div>
      </header>

      <section className="deck-controls">
        <button onClick={handleSelectAll} className="control-button">
          {selectedCards.size === flashcards.length ? "Deselect All" : "Select All"}
        </button>
        <button onClick={handleStartGame} className="control-button start-btn">
          Start Game
        </button>
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
            <>
              <p><strong>Q:</strong> {card.front}</p>
              <p><strong>A:</strong> {card.back}</p>
            </>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Confirmation;

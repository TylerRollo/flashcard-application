// src/pages/PlaygameDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "../styles/pages/PlaygameDetails.css";

const PlaygameDetails = () => {
  const { id } = useParams();
  const [deck, setDeck] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [currentCard, setCurrentCard] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

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
      pickRandomCard(flashcardData);
    } catch (error) {
      console.error('Error fetching deck details:', error);
    }
  };

  const pickRandomCard = (cards) => {
    if (cards.length > 0) {
      const randomIndex = Math.floor(Math.random() * cards.length);
      setCurrentCard(cards[randomIndex]);
      setShowAnswer(false);
    }
  };

  const handleCardClick = () => {
    setShowAnswer(true);
  };

  const handleNextCard = () => {
    pickRandomCard(flashcards);
  };

  return (
    <div className="playgame-container">
      <header className="playgame-header">
        <h1>{deck ? deck.name : 'Loading...'}</h1>
      </header>

      <section className="flashcard-container">
        {currentCard ? (
          <div
            className={`flashcard ${showAnswer ? 'flipped' : ''}`}
            onClick={!showAnswer ? handleCardClick : null}
          >
            <div className="flashcard-content">
              <p><strong>Q:</strong> {currentCard.front}</p>
            </div>
            <div className="flashcard-content flashcard-answer">
              <p><strong>A:</strong> {currentCard.back}</p>
            </div>
          </div>
        ) : (
          <p>Loading flashcards...</p>
        )}
      </section>

      {showAnswer && (
        <button className="next-button" onClick={handleNextCard}>Next Card</button>
      )}
    </div>
  );
};

export default PlaygameDetails;

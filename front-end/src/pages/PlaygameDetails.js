import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "../styles/pages/PlaygameDetails.css";

const PlaygameDetails = () => {
  const { id } = useParams();
  const [deck, setDeck] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [remainingCards, setRemainingCards] = useState([]);
  const [currentCard, setCurrentCard] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(1);

  useEffect(() => {
    fetchDeckDetails();
  }, [id]);

  const fetchWithTimeout = (url, options = {}, timeout = 30000) => {
    return Promise.race([
      fetch(url, options),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Request timed out")), timeout))
    ]);
  };

  const fetchDeckDetails = async () => {
    try {
      const deckResponse = await fetchWithTimeout(`http://localhost:5000/api/decks/${id}`);
      if (!deckResponse.ok) throw new Error(`Error fetching deck: ${deckResponse.status}`);
      const deckData = await deckResponse.json();
      setDeck(deckData);

      const flashcardsResponse = await fetchWithTimeout(`http://localhost:5000/api/flashcards/${id}`);
      if (!flashcardsResponse.ok) throw new Error(`Error fetching flashcards: ${flashcardsResponse.status}`);
      const flashcardData = await flashcardsResponse.json();
      setFlashcards(flashcardData);
      
      resetDeck(flashcardData);
    } catch (error) {
      console.error('Error fetching deck details:', error);
      alert(error.message);
    }
  };

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const resetDeck = (cards) => {
    const shuffledCards = shuffleArray([...cards]);
    setRemainingCards(shuffledCards);
    setCurrentCard(shuffledCards.length > 0 ? shuffledCards[0] : null);
    setCurrentIndex(1);
    setShowAnswer(false);
  };

  const handleNextCard = () => {
    if (remainingCards.length > 1) {
      const newRemaining = [...remainingCards.slice(1)];
      setRemainingCards(newRemaining);
      setCurrentCard(newRemaining[0]);
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    } else {
      alert("You've gone through all the flashcards!");
      resetDeck(flashcards);
    }
  };

  return (
    <div className="playgame-container">
      <h1>{deck ? deck.name : 'Loading...'}</h1>
      <div className="progress-bar-container">
          <div 
            className="progress-bar" 
            style={{ width: `${(currentIndex / flashcards.length) * 100}%` }}
          ></div>
        </div>
      <header className="playgame-header">
        <div className="card-counter">{currentIndex} / {flashcards.length}</div>
      </header>

      <section className="flashcard-container">
        {currentCard ? (
          <div
            className={`flashcard ${showAnswer ? 'flipped' : ''}`}
            onClick={() => setShowAnswer(!showAnswer)}
          >
            <div className="flashcard-content front">
              <p><strong>Q:</strong> {currentCard.front}</p>
            </div>
            <div className="flashcard-content back">
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

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import testModes from "../utils/testModes";
import "../styles/pages/PlaygameDetails.css";

const PlaygameDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const testMode = location.state?.testMode || testModes.FRONT_FIRST; // Default to FRONT_FIRST if not provided
  
  // Deck details
  const { id } = useParams();
  const [deck, setDeck] = useState(null);
  const [flashcards, setFlashcards] = useState([]);

  // Card details
  const [remainingCards, setRemainingCards] = useState([]);
  const [currentCard, setCurrentCard] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [incorrectCards, setIncorrectCards] = useState([]);

  // State controls
  const [showBack, setShowBack] = useState(false);
  const [showNext, setShowNext] = useState(false);

  useEffect(() => {
    fetchDeckDetails();
    setCardFace();
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

      resetDeck(flashcardData);
    } catch (error) {
      console.error("Error fetching deck details:", error);
      alert(error.message);
    }
  };

  const resetDeck = (cards) => {
    const shuffledCards = shuffleArray([...cards]);
    setRemainingCards(shuffledCards);
    setCurrentCard(shuffledCards.length > 0 ? shuffledCards[0] : null);
    setCurrentIndex(1);
    setIncorrectCards([]);
  };

  const setCardFace = () => {
    if (testMode === testModes.FRONT_FIRST) { setShowBack(false); }
    else if (testMode === testModes.BACK_FIRST) { setShowBack(true);}
    else if (testMode === testModes.RANDOM) {
      const randomFace = Math.random() < 0.5 ? false : true;
      setShowBack(randomFace);
    }
  };

  const handleCardClick = () => {
    setShowBack(!showBack);
    setShowNext(!showNext);
  }

  const handleAnswer = (isCorrect) => {
    let updatedCorrectCount = correctCount;
    let updatedIncorrectCount = incorrectCount;
    let updatedIncorrectCards = [...incorrectCards];

    if (isCorrect) {
      updatedCorrectCount += 1;
    } else {
      updatedIncorrectCount += 1;
      updatedIncorrectCards.push(currentCard);
    }

    setCorrectCount(updatedCorrectCount);
    setIncorrectCount(updatedIncorrectCount);
    setIncorrectCards(updatedIncorrectCards);
    setShowBack(!showBack);
    setShowNext(!showNext);

    if (remainingCards.length > 1) {
      const newRemaining = [...remainingCards.slice(1)];
      setRemainingCards(newRemaining);
      setCurrentCard(newRemaining[0]);
      setCurrentIndex(currentIndex + 1);
    } else {
      navigateToResults(updatedCorrectCount, updatedIncorrectCount, updatedIncorrectCards);
    };
    
    setCardFace(testMode);
  };

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const navigateToResults = (
    updatedCorrectCount = correctCount,
    updatedIncorrectCount = incorrectCount,
    updatedIncorrectCards = incorrectCards
  ) => {
    // Add all unseen remaining cards (excluding current) to incorrect
    const unseenCards = remainingCards.slice(1); // currentCard is already shown
    const allIncorrectCards = [...updatedIncorrectCards, ...unseenCards];
  
    navigate("/results", {
      state: {
        correct: updatedCorrectCount,
        incorrect: updatedIncorrectCount + unseenCards.length,
        deckId: id,
        incorrectCards: allIncorrectCards,
      },
    });
  };
  

  return (
    <div className="playgame-container">
      <h1>{deck ? deck.name : "Loading..."}</h1>
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${(currentIndex / flashcards.length) * 100}%` }}></div>
      </div>
      <header className="playgame-header">
        <div className="card-counter">{currentIndex} / {flashcards.length}</div>
      </header>

      <section className="flashcard-container">
        {currentCard ? (
          <div className="flashcard" onClick={handleCardClick}>
            <div className="flashcard-content">
            {showBack ? (
                <p><strong></strong> {currentCard.back}</p>
              ) : (
                <p><strong></strong> {currentCard.front}</p>
              )}
            </div>
          </div>
        ) : (
          <p>Loading flashcards...</p>
        )}
      </section>

      {showNext && (
        <div className="answer-section">
          <div id="answer-label">Did you get that answer correct?</div>
          <div className="button-container">
            <button className="correct-button" onClick={() => handleAnswer(true)}>✔️ Correct</button>
            <button className="incorrect-button" onClick={() => handleAnswer(false)}>✖️ Incorrect</button>
          </div>
        </div>
      )}

      <button className="end-session-button" onClick={() => navigateToResults()}>⏹️ End Session</button>
    </div>
  );
};

export default PlaygameDetails;

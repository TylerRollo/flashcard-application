import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/pages/PlaygameDetails.css";

const PlaygameDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [deck, setDeck] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [remainingCards, setRemainingCards] = useState([]);
  const [currentCard, setCurrentCard] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [incorrectCards, setIncorrectCards] = useState([]); // Track incorrect cards

  useEffect(() => {
    fetchDeckDetails();
  }, [id]);

  const fetchWithTimeout = (url, options = {}, timeout = 30000) => {
    return Promise.race([
      fetch(url, options),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Request timed out")), timeout)),
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
      console.error("Error fetching deck details:", error);
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
    setIncorrectCards([]); // Reset incorrect cards
  };

  const handleAnswer = (isCorrect) => {
    // Update correct and incorrect counts immediately within this function
    let updatedCorrectCount = correctCount;
    let updatedIncorrectCount = incorrectCount;
    let updatedIncorrectCards = [...incorrectCards];
  
    if (isCorrect) {
      updatedCorrectCount += 1;
    } else {
      updatedIncorrectCount += 1;
      updatedIncorrectCards.push(currentCard); // Store the incorrect card
    }
  
    // Update the state directly using the updated values
    setCorrectCount(updatedCorrectCount);
    setIncorrectCount(updatedIncorrectCount);
    setIncorrectCards(updatedIncorrectCards);
  
    if (remainingCards.length > 1) {
      const newRemaining = [...remainingCards.slice(1)];
      setRemainingCards(newRemaining);
      setCurrentCard(newRemaining[0]);
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    } else {
      navigateToResults(updatedCorrectCount, updatedIncorrectCount, updatedIncorrectCards);
    }
  };
  
  const navigateToResults = (updatedCorrectCount, updatedIncorrectCount, updatedIncorrectCards) => {
    navigate("/results", {
      state: {
        correct: updatedCorrectCount,
        incorrect: updatedIncorrectCount,
        deckId: id,
        incorrectCards: updatedIncorrectCards, // Pass updated incorrect cards
      },
    });
  };
  

  const endSessionImmediately = () => {
    const unansweredIncorrectCards = remainingCards.filter((card) => !incorrectCards.includes(card));
    setIncorrectCards([...incorrectCards, ...unansweredIncorrectCards]);

    navigate("/results", {
      state: {
        correct: correctCount,
        incorrect: incorrectCount + unansweredIncorrectCards.length,
        deckId: id,
        incorrectCards: [...incorrectCards, ...unansweredIncorrectCards],
      },
    });
  };

  return (
    <div className="playgame-container">
      <h1>{deck ? deck.name : "Loading..."}</h1>
      <div className="progress-bar-container">
        <div
          className="progress-bar"
          style={{ width: `${(currentIndex / flashcards.length) * 100}%` }}
        ></div>
      </div>
      <header className="playgame-header">
        <div className="card-counter">
          {currentIndex} / {flashcards.length}
        </div>
      </header>

      <section className="flashcard-container">
        {currentCard ? (
          <div
            className={`flashcard ${showAnswer ? "flipped" : ""}`}
            onClick={() => setShowAnswer(!showAnswer)}
          >
            <div className="flashcard-content front">
              <p>
                <strong>Q:</strong> {currentCard.front}
              </p>
            </div>
            <div className="flashcard-content back">
              <p>
                <strong>A:</strong> {currentCard.back}
              </p>
            </div>
          </div>
        ) : (
          <p>Loading flashcards...</p>
        )}
      </section>

      {showAnswer && (
        <div className="button-container">
          <label className="answer-label">Did you get that answer correct?</label>
          <button className="correct-button" onClick={() => handleAnswer(true)}>
            ✔️ Correct
          </button>
          <button className="incorrect-button" onClick={() => handleAnswer(false)}>
            ✖️ Incorrect
          </button>
        </div>
      )}

      <button className="end-session-button" onClick={endSessionImmediately}>
        ⏹️ End Session
      </button>
    </div>
  );
};

export default PlaygameDetails;

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import testModes from "../utils/testModes"; // Import predefined test mode constants
import "../styles/pages/PlaygameDetails.css"; // Import CSS styles

const PlaygameDetails = () => {
  const navigate = useNavigate(); // Hook for navigation
  const location = useLocation(); // Hook to access passed-in state (like testMode)
  const testMode = location.state?.testMode || testModes.FRONT_FIRST; // Default to FRONT_FIRST if undefined

  // Get deck ID from the route parameter
  const { id } = useParams();

  // Deck and flashcard data
  const [deck, setDeck] = useState(null);
  const [flashcards, setFlashcards] = useState([]);

  // Current card state and progress tracking
  const [remainingCards, setRemainingCards] = useState([]);
  const [currentCard, setCurrentCard] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(1);

  // Answer tracking
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [incorrectCards, setIncorrectCards] = useState([]);

  // UI state controls
  const [showBack, setShowBack] = useState(false); // Controls card face
  const [showNext, setShowNext] = useState(false); // Controls visibility of answer buttons

  // Fetch data on component mount
  useEffect(() => {
    fetchDeckDetails();
    setCardFace(); // Set card face based on test mode
  }, [id]);

  // Fetch deck and flashcards from backend
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

      resetDeck(flashcardData); // Initialize card state
    } catch (error) {
      console.error("Error fetching deck details:", error);
      alert(error.message);
    }
  };

  // Resets flashcard sequence and progress tracking
  const resetDeck = (cards) => {
    const shuffledCards = shuffleArray([...cards]);
    setRemainingCards(shuffledCards);
    setCurrentCard(shuffledCards.length > 0 ? shuffledCards[0] : null);
    setCurrentIndex(1);
    setIncorrectCards([]);
  };

  // Determines which side of the card to show first
  const setCardFace = () => {
    if (testMode === testModes.FRONT_FIRST) {
      setShowBack(false);
    } else if (testMode === testModes.BACK_FIRST) {
      setShowBack(true);
    } else if (testMode === testModes.RANDOM) {
      const randomFace = Math.random() < 0.5;
      setShowBack(randomFace);
    }
  };

  // Toggles card face and shows answer options
  const handleCardClick = () => {
    setShowBack(!showBack);
    setShowNext(!showNext);
  };

  // Handles user marking the current card as correct or incorrect
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
    }

    // Reset face for next card
    setCardFace(testMode);
  };

  // Randomizes array of flashcards
  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  // Redirects to results page, passing along performance data
  const navigateToResults = (
    updatedCorrectCount = correctCount,
    updatedIncorrectCount = incorrectCount,
    updatedIncorrectCards = incorrectCards
  ) => {
    const unseenCards = remainingCards.slice(1); // currentCard is already shown
    const allIncorrectCards = [...updatedIncorrectCards, ...unseenCards]; // Track skipped/unseen as incorrect

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
      {/* Deck title or loading message */}
      <h1>{deck ? deck.name : "Loading..."}</h1>

      {/* Progress bar */}
      <div className="progress-bar-container">
        <div
          className="progress-bar"
          style={{ width: `${(currentIndex / flashcards.length) * 100}%` }}
        ></div>
      </div>

      <header className="playgame-header">
        <div className="card-counter">{currentIndex} / {flashcards.length}</div>
      </header>

      {/* Flashcard display */}
      <section className="flashcard-container">
        {currentCard ? (
          <div className="flashcard" onClick={handleCardClick}>
            <div className="flashcard-content">
              {showBack ? (
                <p>{currentCard.back}</p>
              ) : (
                <p>{currentCard.front}</p>
              )}
            </div>
          </div>
        ) : (
          <p>Loading flashcards...</p>
        )}
      </section>

      {/* Answer buttons */}
      {showNext && (
        <div className="answer-section">
          <div id="answer-label">Did you get that answer correct?</div>
          <div className="button-container">
            <button className="correct-button" onClick={() => handleAnswer(true)}>✔️ Correct</button>
            <button className="incorrect-button" onClick={() => handleAnswer(false)}>✖️ Incorrect</button>
          </div>
        </div>
      )}

      {/* End session early */}
      <button className="end-session-button" onClick={() => navigateToResults()}>
        ⏹️ End Session
      </button>
    </div>
  );
};

export default PlaygameDetails;

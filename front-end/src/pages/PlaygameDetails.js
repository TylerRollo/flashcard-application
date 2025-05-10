import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import testModes from "../utils/testModes"; // Predefined constants for testing modes (front-first, back-first, random)
import "../styles/pages/PlaygameDetails.css"; // Styling for the PlaygameDetails component
import { toast } from "react-toastify"; // Notification library (not currently used in this file)

// Flashcard test play page
const PlaygameDetails = () => {
  const navigate = useNavigate(); // Navigation hook to move between pages
  const location = useLocation(); // Access data passed via route state
  const testMode = location.state?.testMode || testModes.FRONT_FIRST; // Use passed test mode, default to FRONT_FIRST

  // Get deck ID from URL route parameter
  const { id } = useParams();

  // Deck and flashcard data passed via location state from previous page
  const deck = location.state?.deck || null;
  const flashcards = location.state?.flashcards || [];

  // State for tracking flashcard progression
  const [remainingCards, setRemainingCards] = useState([]); // Cards yet to be shown
  const [currentCard, setCurrentCard] = useState(null); // Card currently displayed
  const [currentIndex, setCurrentIndex] = useState(1); // 1-based index for progress bar

  // State for tracking user answers
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [incorrectCards, setIncorrectCards] = useState([]); // Tracks which cards were missed

  // State for UI behavior
  const [showBack, setShowBack] = useState(false); // Determines which side of the card is showing
  const [showNext, setShowNext] = useState(false); // Shows answer buttons once card is flipped

  // Initialize on first render or when deck ID changes
  useEffect(() => {
    resetDeck(flashcards); // Shuffle and prepare cards
    setCardFace(); // Set which face of the card to show based on test mode
  }, [id]);

  // Resets the deck and state tracking for a fresh start
  const resetDeck = (cards) => {
    const shuffledCards = shuffleArray([...cards]); // Create a shuffled copy
    setRemainingCards(shuffledCards);
    setCurrentCard(shuffledCards.length > 0 ? shuffledCards[0] : null);
    setCurrentIndex(1);
    setIncorrectCards([]);
  };

  // Set the initial face of the card depending on selected test mode
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

  // When user clicks the card, toggle face and show answer buttons
  const handleCardClick = () => {
    setShowBack(!showBack); // Flip card
    setShowNext(!showNext); // Show answer buttons
  };

  // Handle when user selects either "Correct" or "Incorrect"
  const handleAnswer = (isCorrect) => {
    let updatedCorrectCount = correctCount;
    let updatedIncorrectCount = incorrectCount;
    let updatedIncorrectCards = [...incorrectCards];

    if (isCorrect) {
      updatedCorrectCount += 1;
    } else {
      updatedIncorrectCount += 1;
      updatedIncorrectCards.push(currentCard); // Track incorrect answer
    }

    // Update state with answer
    setCorrectCount(updatedCorrectCount);
    setIncorrectCount(updatedIncorrectCount);
    setIncorrectCards(updatedIncorrectCards);

    // Reset UI
    setShowBack(!showBack); // Flip back to original side
    setShowNext(!showNext); // Hide answer buttons

    // Move to next card if available, otherwise go to results page
    if (remainingCards.length > 1) {
      const newRemaining = [...remainingCards.slice(1)];
      setRemainingCards(newRemaining);
      setCurrentCard(newRemaining[0]);
      setCurrentIndex(currentIndex + 1);
    } else {
      // All cards completed, navigate to results
      navigateToResults(updatedCorrectCount, updatedIncorrectCount, updatedIncorrectCards);
    }

    // Re-randomize card face if in RANDOM mode
    setCardFace(testMode);
  };

  // Shuffles flashcard array using Fisher-Yates-style shuffle
  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  // Redirect to results page, passing along performance data and deck reference
  const navigateToResults = (
    updatedCorrectCount = correctCount,
    updatedIncorrectCount = incorrectCount,
    updatedIncorrectCards = incorrectCards
  ) => {
    const unseenCards = remainingCards.slice(1); // Any cards not yet shown are considered skipped
    const allIncorrectCards = [...updatedIncorrectCards, ...unseenCards]; // Treat skipped cards as incorrect

    navigate("/results", {
      state: {
        correct: updatedCorrectCount,
        incorrect: updatedIncorrectCount + unseenCards.length,
        deckId: id,
        incorrectCards: allIncorrectCards,
        testMode: testMode,
        flashcards
      },
    });
  };

  return (
    <div className="playgame-container">
      {/* Display the deck title or loading message */}
      <h1>{deck ? deck.name : "Loading..."}</h1>

      {/* Dynamic progress bar based on current index */}
      <div className="progress-bar-container">
        <div
          className="progress-bar"
          style={{ width: `${(currentIndex / flashcards.length) * 100}%` }}
        ></div>
      </div>

      {/* Display the current flashcard number out of total */}
      <header className="playgame-header">
        <div className="card-counter">{currentIndex} / {flashcards.length}</div>
      </header>

      {/* Flashcard rendering */}
      <section className="flashcard-container">
        {currentCard ? (
          <div className="flashcard" onClick={handleCardClick}>
            <div className="flashcard-content">
              {/* Show front or back depending on showBack state */}
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

      {/* Show answer buttons only after card has been flipped */}
      {showNext && (
        <div className="answer-section">
          <div id="answer-label">Did you get that answer correct?</div>
          <div className="button-container">
            <button className="correct-button" onClick={() => handleAnswer(true)}>✔️ Correct</button>
            <button className="incorrect-button" onClick={() => handleAnswer(false)}>✖️ Incorrect</button>
          </div>
        </div>
      )}

      {/* Allow user to end session early and view results */}
      <button className="end-session-button" onClick={() => navigateToResults()}>
        ⏹️ End Session
      </button>
    </div>
  );
};

export default PlaygameDetails;

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "../styles/pages/PlaygameDetails.css";

const PlaygameDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { frontFirst } = location.state || { frontFist : false }; // Default to true if not provided
  console.log("frontFirst value:", frontFirst); // ✅ Log here to check the received value
  
  const { id } = useParams();
  const [deck, setDeck] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [remainingCards, setRemainingCards] = useState([]);
  const [currentCard, setCurrentCard] = useState(null);
  const [showBack, setShowBack] = useState(false); // Determines whether to show the back of the card
  const [currentIndex, setCurrentIndex] = useState(1);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [incorrectCards, setIncorrectCards] = useState([]);

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
    setShowBack(false); // Start with the front side
    setIncorrectCards([]);
  };

  const handleCardClick = () => {
    setShowBack(!showBack); // Toggle between front and back
  };

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
    setShowBack(false); // Reset to front side for the next card

    setTimeout(() => {
      if (remainingCards.length > 1) {
        const newRemaining = [...remainingCards.slice(1)];
        setRemainingCards(newRemaining);
        setCurrentCard(newRemaining[0]);
        setCurrentIndex(currentIndex + 1);
      } else {
        navigateToResults(updatedCorrectCount, updatedIncorrectCount, updatedIncorrectCards);
      }
    }, 100); // Delay should match your CSS animation time
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
        frontFirtst: showBack
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
                <p><strong>A:</strong> {frontFirst ? currentCard.back : currentCard.front}</p>
              ) : (
                <p><strong>Q:</strong> {frontFirst ? currentCard.front : currentCard.back}</p>
              )}
            </div>
          </div>
        ) : (
          <p>Loading flashcards...</p>
        )}
      </section>

      {showBack && (
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

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Decks = () => {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        // Replace with the actual API endpoint to fetch all decks for a user
        const response = await axios.get('http://localhost:5000/api/decks/1'); // Assume userId is 1 for this example
        setDecks(response.data); // Update the state with fetched decks
      } catch (err) {
        setError('Failed to fetch decks');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDecks();
  }, []); // Empty dependency array means this runs once on mount

  if (loading) return <h2>Loading decks...</h2>;
  if (error) return <h2>{error}</h2>;

  return (
    <div>
      <h2>Decks</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div>
          {decks.length > 0 ? (
            decks.map((deck) => (
              <div key={deck.id}>
                <h3>{deck.name}</h3>
                <p>{deck.description}</p>
                <button onClick={() => alert('Display cards for this deck')}>
                  Show Cards
                </button>
              </div>
            ))
          ) : (
            <p>No decks available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Decks;

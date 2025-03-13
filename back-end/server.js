// server.js
import express from 'express';
import cors from 'cors';
import flashcardsRouter from './routes/flashcards.js';
import decksRouter from './routes/decks.js';

const app = express();
app.use(cors());
app.use(express.json()); // Allow JSON body parsing

// Routes
app.use('/api/decks', decksRouter);
app.use('/api/flashcards', flashcardsRouter);  // Make sure this handles POST /api/decks/:deckId/flashcards

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// routes/flashcards.js
import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Get flashcards for a specific deck
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [flashcards] = await pool.query('SELECT * FROM flashcards WHERE deck_id = ?', [id]);
    if (flashcards.length === 0) return res.status(404).json({ error: 'Flashcards not found' });
    res.json(flashcards);
  } catch (error) {
    console.error('Error fetching flashcards:', error);
    res.status(500).json({ error: 'Database error when fetching flashcards' });
  }
});

/** 🟢 POST (Create) a new flashcards */
router.post('/:id', async (req, res) => {
  const deck_id = Number(req.body.deck_id);
  const { front, back } = req.body;

  console.log("Incoming request body:", req.body);

  if (!front || !back) {
    return res.status(400).json({ error: 'front and back are required' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO flashcards (deck_id, front, back) VALUES (?, ?, ?)',
      [deck_id, front, back || null]  // Ensure `deck_id` is correctly passed
    );
    res.status(201).json({ message: 'Flashcard created', id: result.insertId });
  } catch (error) {
    console.error('Error creating flashcard:', error);
    res.status(500).json({ error: 'Database error when creating flashcards' });
  }
});

/** 🟢 DELETE a flashcard */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM flashcards WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Flashcard not found' });

    res.json({ message: 'Flashcard deleted' });
  } catch (error) {
    console.error('Error deleting flashcard:', error);
    res.status(500).json({ error: 'Database error when deleting flashcard' });
  }
});


export default router;

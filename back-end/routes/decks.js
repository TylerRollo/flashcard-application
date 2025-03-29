// backend/routes/decks.js
import express from 'express';
import pool from '../db.js';

const router = express.Router();

/** 🟢 GET all decks */
router.get('/', async (req, res) => {
  try {
    const [decks] = await pool.query('SELECT * FROM decks');
    res.json(decks);
  } catch (error) {
    console.error('Error fetching decks:', error);
    res.status(500).json({ error: 'Database error when fetching decks' });
  }
});

/** 🟢 GET a single deck by ID */
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [deck] = await pool.query('SELECT * FROM decks WHERE id = ?', [id]);
    if (deck.length === 0) return res.status(404).json({ error: 'Deck not found' });
    res.json(deck[0]);
  } catch (error) {
    console.error('Error fetching deck:', error);
    res.status(500).json({ error: 'Database error when fetching deck' });
  }
});

/** 🟢 POST (Create) a new deck */
router.post('/', async (req, res) => {
  const { user_id, name, description } = req.body;
  
  console.log("Incoming request body:", req.body); // 🔹 Debugging: Log request data

  if (!user_id || !name) {
    return res.status(400).json({ error: 'user_id and name are required' }); // 🔹 Handle missing data
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO decks (user_id, name, description) VALUES (?, ?, ?)',
      [user_id, name, description || null]
    );
    res.status(201).json({ message: 'Deck created', deck_id: result.insertId });
  } catch (error) {
    console.error('Error creating deck:', error);
    res.status(500).json({ error: 'Database error when creating deck' });
  }
});

/** 🟢 PUT (Update) a deck’s name/description */
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const [result] = await pool.query(
      'UPDATE decks SET name = ?, description = ? WHERE id = ?',
      [name, description, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Deck not found' });

    res.json({ message: 'Deck updated' });
  } catch (error) {
    console.error('Error updating deck:', error);
    res.status(500).json({ error: 'Database error when updating deck' });
  }
});

/** 🟢 DELETE a deck */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM decks WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Deck not found' });

    res.json({ message: 'Deck deleted' });
  } catch (error) {
    console.error('Error deleting deck:', error);
    res.status(500).json({ error: 'Database error when deleting deck' });
  }
});

// TODO: Add a delete all button with TWO confirmations

export default router;

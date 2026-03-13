const express = require('express');
const router = express.Router();
const {
  createJournal,
  getAllJournals,
  updateJournal,
  deleteJournal,
} = require('../controllers/journalController');

// POST   /api/journals     → Create new journal entry
router.post('/', createJournal);

// GET    /api/journals     → Get all journal entries
router.get('/', getAllJournals);

// PUT    /api/journals/:id → Update a journal entry
router.put('/:id', updateJournal);

// DELETE /api/journals/:id → Delete a journal entry
router.delete('/:id', deleteJournal);

module.exports = router;

const Journal = require('../models/journalModel');

const createJournal = async (req, res) => {
  try {
    const { title, pages, aiReply } = req.body;

    // 1. Validate title
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'A valid journal title is required' });
    }

    // 2. Filter and process pages
    let processedPages = [];
    if (Array.isArray(pages)) {
      processedPages = pages
        .map((page, index) => {
          // Normalize: ensure it's an object and has text
          const text = page && typeof page.text === 'string' ? page.text.trim() : '';
          return {
            text,
            pageNumber: Number(page?.pageNumber) || index + 1
          };
        })
        .filter(page => page.text.length > 0); // Remove pages with no content
    }

    // 3. Final validation for pages existence
    if (processedPages.length === 0) {
      return res.status(400).json({ error: 'Journal must contain at least one page with text' });
    }

    // 4. Create document
    const journal = await Journal.create({
      title: title.trim(),
      pages: processedPages,
      aiReply: aiReply || '',
    });

    res.status(201).json(journal);
  } catch (error) {
    console.error('Create journal error:', error.message);

    // Check for Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ error: messages.join(', ') });
    }

    res.status(500).json({ error: 'Internal server error while creating journal entry' });
  }
};

// @desc    Get all journal entries
// @route   GET /api/journals
const getAllJournals = async (req, res) => {
  try {
    const journals = await Journal.find().sort({ createdAt: -1 });
    res.status(200).json(journals);
  } catch (error) {
    console.error('Get journals error:', error.message);
    res.status(500).json({ error: 'Failed to fetch journal entries' });
  }
};

const updateJournal = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, pages, aiReply } = req.body;

    const journal = await Journal.findById(id);
    if (!journal) {
      return res.status(404).json({ error: 'Journal entry not found' });
    }

    // 1. Process Title update
    if (title !== undefined) {
      if (typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({ error: 'A valid journal title is required' });
      }
      journal.title = title.trim();
    }

    // 2. Process Pages update
    if (pages !== undefined) {
      if (!Array.isArray(pages)) {
        return res.status(400).json({ error: 'Pages must be an array' });
      }

      const processedPages = pages
        .map((page, index) => {
          const text = page && typeof page.text === 'string' ? page.text.trim() : '';
          return {
            text,
            pageNumber: Number(page?.pageNumber) || index + 1
          };
        })
        .filter(page => page.text.length > 0);

      if (processedPages.length === 0) {
        return res.status(400).json({ error: 'Journal must contain at least one page with text' });
      }
      journal.pages = processedPages;
    }

    // 3. Process AI Reply update
    if (aiReply !== undefined) {
      journal.aiReply = aiReply;
    }

    const updated = await journal.save();
    res.status(200).json(updated);
  } catch (error) {
    console.error('Update journal error:', error.message);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ error: messages.join(', ') });
    }

    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid journal ID' });
    }

    res.status(500).json({ error: 'Internal server error while updating journal entry' });
  }
};

// @desc    Delete a journal entry
// @route   DELETE /api/journals/:id
const deleteJournal = async (req, res) => {
  try {
    const { id } = req.params;

    const journal = await Journal.findByIdAndDelete(id);

    if (!journal) {
      return res.status(404).json({ error: 'Journal entry not found' });
    }

    res.status(200).json({ message: 'Journal entry deleted', id });
  } catch (error) {
    console.error('Delete journal error:', error.message);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid journal ID' });
    }
    res.status(500).json({ error: 'Failed to delete journal entry' });
  }
};

module.exports = {
  createJournal,
  getAllJournals,
  updateJournal,
  deleteJournal,
};

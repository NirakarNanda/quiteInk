const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    pageNumber: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const journalSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    pages: {
      type: [pageSchema],
      validate: {
        validator: (v) => v.length > 0,
        message: 'At least one page is required',
      },
    },
    aiReply: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model('Journal', journalSchema);

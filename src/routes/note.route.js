import express from 'express';

import {
  addNoteValidation,
  updateNoteValidation,
} from '../middleware/validations.js';

import {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from '../controllers/note.controller.js';

const router = express.Router();

router.get('/', getNotes);
router.get('/:id', getNoteById);
router.post('/', addNoteValidation, createNote);
router.put('/:id', updateNoteValidation, updateNote);
router.delete('/:id', deleteNote);

export default router;

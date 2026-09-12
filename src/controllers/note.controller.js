import Note from '../models/Note.js';

export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ creator: req.user.id });
    res.status(200).json(notes);
  } catch (error) {
    console.error('Error in getNotes controller: ' + error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findOne({
      $and: [{ _id: id }, { creator: req.user._id }],
    });

    if (!note) return res.status(404).json({ message: 'Note note found' });

    res.status(200).json(note);
  } catch (error) {
    console.error('Error in getNoteById controller: ' + error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content)
      return res.status(400).json({ message: 'All fields are required' });

    const exists = await Note.findOne({
      $and: [{ title }, { creator: req.user._id }],
    });

    if (exists)
      return res.status(400).json({ message: 'Note with this title exists' });

    const note = await Note.create({ title, content, creator: req.user._id });
    res.status(201).json({ message: 'Note created successfully' });
  } catch (error) {
    console.error('Error in createNote controller: ' + error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const exists = await Note.findOne({
      $and: [{ title: title }, { creator: req.user._id }],
    });

    if (exists)
      return res.status(400).json({ message: 'Note with this title exists' });

    const note = await Note.findOneAndUpdate(
      { $and: [{ _id: id }, { creator: req.user._id }] },
      { title, content },
      { returnDocument: 'after' },
    );

    if (!note) return res.status(404).json({ message: 'Note not found' });

    res.status(200).json({ message: 'Note updated successfully' });
  } catch (error) {
    console.error('Error in updateNote controller: ' + error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findOneAndDelete({
      $and: [{ _id: id }, { creator: req.user._id }],
    });

    if (!note) return res.status(404).json({ message: 'Note not found' });

    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error in deleteNote controller: ' + error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

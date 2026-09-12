import Note from '../models/Note.js';

export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ creator: req.user._id });
    res.status(200).json(notes);
  } catch (error) {
    console.error('Error in getNotes controller: ' + error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findOne({ _id: id });

    if (!note) return res.status(400).json({ message: 'Invalid note id' });

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

    const note = await Note.create({ title, content });
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

    const exists = await Note.findOne({ title });

    if (exists)
      return res.status(400).json({ message: 'Note with this title exists' });

    const note = await Note.findOneAndUpdate(
      { _id: id },
      { title, content },
      { returnDocument: 'after' },
    );

    if (!note) return res.status(400).json({ message: 'Invalid note id' });

    res.status(200).json({ message: 'Note updated successfully' });
  } catch (error) {
    console.error('Error in updateNote controller: ' + error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findOneAndDelete({ _id: id });

    if (!note) return res.status(400).json({ message: 'Invalid note id' });

    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error in deleteNote controller: ' + error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

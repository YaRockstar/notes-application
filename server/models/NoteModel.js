import MongoNoteModel from '../schemas/note.model.js';

class NoteModel {
  async createNote(note) {
    const createdNote = new MongoNoteModel({
      title: note.title,
      content: note.content,
      tags: note.tags ?? [],
      userId: note.userId,
    });

    return await this.updateNote(createdNote);
  }

  async updateNote(note) {
    await note.save();
    return note;
  }

  async deleteNote(note) {
    await note.deleteOne({ _id: note._id });
  }

  async findById(noteId) {
    return await MongoNoteModel.findOne({ _id: noteId });
  }

  async findAllDesc(userId) {
    return await MongoNoteModel.find({ userId: userId }).sort({ isPinned: -1 });
  }

  async findAllByRegex(userId, query) {
    return await MongoNoteModel.find({
      userId,
      $or: [
        { title: { $regex: new RegExp(query, 'i') } },
        { content: { $regex: new RegExp(query, 'i') } },
        { tags: { $regex: new RegExp(query, 'i') } },
      ],
    });
  }
}

export const noteModel = new NoteModel();

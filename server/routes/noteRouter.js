import Router from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { noteController } from '../controllers/NoteController.js';

const noteRouter = new Router();

noteRouter.get('/notes', authMiddleware, noteController.getUserNotes);
noteRouter.post('/notes', authMiddleware, noteController.createNote);
noteRouter.put('/notes/:noteId', authMiddleware, noteController.updateNote);
noteRouter.delete('/notes/:noteId', authMiddleware, noteController.deleteNote);
noteRouter.get('/notes/search', authMiddleware, noteController.searchNotes);

export default noteRouter;

import RequestError from '../constants/errors.js';
import { noteModel } from '../models/NoteModel.js';

class NoteController {
  /**
   * Получение всех заметок пользователя.
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async getUserNotes(req, res) {
    const userId = req.user._id;

    try {
      const notes = await noteModel.findAllDesc(userId);

      return res.json({
        error: false,
        notes,
        message: 'Возвращены все заметки пользователя',
      });
    } catch (error) {
      return res.status(RequestError.INTERNAL_SERVER_ERROR.status).json({
        error: true,
        message: RequestError.INTERNAL_SERVER_ERROR.message,
      });
    }
  }

  /**
   * Создание заметки.
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async createNote(req, res) {
    const { title, content, tags } = req.body;
    const userId = req.user._id;

    if (!title) {
      return res.status(RequestError.BAD_REQUEST.status).json({
        error: true,
        message: 'Необходим заголовок у заметки',
      });
    }

    if (!content) {
      return res.status(RequestError.BAD_REQUEST.status).json({
        error: true,
        message: 'Необходимо содержимое у заметки',
      });
    }

    try {
      const note = await noteModel.createNote({
        title,
        content,
        tags,
        userId,
      });

      return res.json({
        error: false,
        note,
        message: 'Заметка успешно сохранена',
      });
    } catch (error) {
      return res.status(RequestError.INTERNAL_SERVER_ERROR.status).json({
        error: true,
        message: RequestError.INTERNAL_SERVER_ERROR.message,
      });
    }
  }

  /**
   * Изменение заметки.
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async updateNote(req, res) {
    const noteId = req.params.noteId;
    const { title, content, tags, isPinned } = req.body;

    if (!title && !content && !tags && isPinned === undefined) {
      return res.status(RequestError.BAD_REQUEST.status).json({
        error: true,
        message: `${RequestError.BAD_REQUEST.message}: нет изменений`,
      });
    }

    try {
      const note = await noteModel.findById(noteId);

      if (!note) {
        return res.status(RequestError.NOT_FOUND.status).json({
          error: true,
          message: `${RequestError.NOT_FOUND.message}: заметка не найдена`,
        });
      }

      if (title !== undefined) {
        note.title = title;
      }

      if (content !== undefined) {
        note.content = content;
      }

      if (tags !== undefined) {
        note.tags = tags;
      }

      if (isPinned !== undefined) {
        note.isPinned = isPinned;
      }

      await noteModel.updateNote(note);

      return res.json({
        error: false,
        note: {
          _id: note._id,
          title: note.title,
          content: note.content,
          tags: note.tags,
          isPinned: note.isPinned,
          createdOn: note.createdOn,
        },
        message: 'Заметка обновлена',
      });
    } catch (error) {
      return res.status(RequestError.INTERNAL_SERVER_ERROR.status).json({
        error: true,
        message: RequestError.INTERNAL_SERVER_ERROR.message,
      });
    }
  }

  /**
   * Удаление заметки.
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async deleteNote(req, res) {
    const noteId = req.params.noteId;

    try {
      const note = await noteModel.findById(noteId);

      if (!note) {
        return res.status(RequestError.NOT_FOUND.status).json({
          error: true,
          message: `${RequestError.NOT_FOUND.message}: заметка не найдена`,
        });
      }

      await noteModel.deleteNote(note);

      return res.json({
        error: false,
        noteId: noteId,
        message: 'Заметка удалена',
      });
    } catch (error) {
      return res.status(RequestError.INTERNAL_SERVER_ERROR.status).json({
        error: true,
        message: RequestError.INTERNAL_SERVER_ERROR.message,
      });
    }
  }

  /**
   * Поиск заметок в соответствие с запросом.
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async searchNotes(req, res) {
    const { query } = req.query;
    const userId = req.user._id;

    if (!query) {
      return res.status(RequestError.BAD_REQUEST.status).json({
        error: true,
        message: `${RequestError.BAD_REQUEST.message}: необходимы параметры поиска`,
      });
    }

    try {
      const matchingNotes = await noteModel.findAllByRegex(userId, query);

      return res.json({
        error: false,
        notes: matchingNotes,
        message: 'Найдены соответствующие поисковому запросу заметки',
      });
    } catch (error) {
      return res.status(RequestError.INTERNAL_SERVER_ERROR.status).json({
        error: true,
        message: RequestError.INTERNAL_SERVER_ERROR.message,
      });
    }
  }
}

export const noteController = new NoteController();

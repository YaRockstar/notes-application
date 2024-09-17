import dotenv from 'dotenv';
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import { authenticateJwtToken } from './utils/authUtil.js';
import { createAccessToken } from './utils/authUtil.js';
import UserModel from './models/user.model.js';
import NoteModel from './models/note.model.js';
import config from './config.json' assert { type: 'json' };

dotenv.config();
mongoose.connect(config.connection);

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());

app.use(
  cors({
    origin: '*',
  })
);

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({
      error: true,
      message: 'Необходима почта',
    });
  }

  if (!password) {
    return res.status(400).json({
      error: true,
      message: 'Необходим пароль',
    });
  }

  try {
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return res.json({
        error: true,
        message: 'Пользователя не существует',
      });
    }

    if (user.email !== email || user.password !== password) {
      return res.json({
        error: true,
        message: 'Невалидные данные для входа',
      });
    }

    const accessToken = createAccessToken(user);
    const simplifiedUser = user.toObject();
    delete simplifiedUser.password;
    delete simplifiedUser.createdOn;
    delete simplifiedUser.__v;

    return res.json({
      error: false,
      user: simplifiedUser,
      accessToken,
      message: 'Успешный вход',
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Внутренняя ошибка сервера',
    });
  }
});

app.post('/users/', async (req, res) => {
  const { email, password, fullName } = req.body;

  if (!email) {
    return res.status(400).json({
      error: true,
      message: 'Необходима почта',
    });
  }

  if (!password) {
    return res.status(400).json({
      error: true,
      message: 'Необходим пароль',
    });
  }

  if (!fullName) {
    return res.status(400).json({
      error: true,
      message: 'Необходимо полное имя',
    });
  }

  const existingUser = await UserModel.findOne({ email: email });

  if (existingUser) {
    return res.json({
      error: true,
      message: 'Пользователь уже существует',
    });
  }

  try {
    const user = new UserModel({
      email,
      password,
      fullName,
    });
    await user.save();

    return res.json({
      error: false,
      user: {
        _id: user._id,
        email,
        fullName,
      },
      accessToken: createAccessToken(user),
      message: 'Регистрация прошла успешно',
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Внутренняя ошибка сервера',
    });
  }
});

app.get('/users/:userId', authenticateJwtToken, async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await UserModel.findOne({ _id: userId }).select(
      '-password -createdOn -__v'
    );

    if (!user) {
      return res.sendStatus(401);
    }

    return res.json({
      error: false,
      user,
      message: 'Возвращен пользователь',
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Внутренняя ошибка сервера',
    });
  }
});

app.get('/users/:userId/notes', authenticateJwtToken, async (req, res) => {
  const { user } = req.user;

  try {
    const notes = await NoteModel.find({ userId: user._id }).sort({ isPinned: -1 });

    return res.json({
      error: false,
      notes,
      message: 'Возвращены все заметки пользователя',
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Внутренняя ошибка сервера',
    });
  }
});

app.post('/users/:userId/notes', authenticateJwtToken, async (req, res) => {
  const { title, content, tags } = req.body;
  const { user } = req.user;

  if (!title) {
    return res.status(400).json({
      error: true,
      message: 'Необходим заголовок у заметки',
    });
  }

  if (!content) {
    return res.status(400).json({
      error: true,
      message: 'Необходимо содержимое у заметки',
    });
  }

  try {
    const note = new NoteModel({
      title,
      content,
      tags: tags ?? [],
      userId: user._id,
    });

    await note.save();

    return res.json({
      error: false,
      note,
      message: 'Заметка успешно сохранена',
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: true,
      message: 'Внутренняя ошибка сервера',
    });
  }
});

app.put('/users/:userId/notes/:noteId', authenticateJwtToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { title, content, tags, isPinned } = req.body;
  const { user } = req.user;

  if (!title && !content && !tags && isPinned === undefined) {
    return res.status(400).json({
      error: true,
      message: 'Нет изменений',
    });
  }

  try {
    const note = await NoteModel.findOne({
      _id: noteId,
      userId: user._id,
    });

    if (!note) {
      return res.status(404).json({
        error: true,
        message: 'Заметка не найдена',
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

    await note.save();

    return res.json({
      error: false,
      note,
      message: 'Заметка обновлена',
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Внутренняя ошибка сервера',
    });
  }
});

app.delete('/users/:userId/notes/:noteId', authenticateJwtToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { user } = req.user;

  try {
    const note = await NoteModel.findOne({
      _id: noteId,
      userId: user._id,
    });

    if (!note) {
      return res.status(404).json({
        error: true,
        message: 'Заметка не найдена',
      });
    }

    await note.deleteOne({
      _id: noteId,
      userId: user._id,
    });

    return res.json({
      error: false,
      noteId: note._id,
      message: 'Заметка удалена',
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Внутренняя ошибка сервера',
    });
  }
});

app.get('/users/:userId/notes/search', authenticateJwtToken, async (req, res) => {
  const { user } = req.user;
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({
      error: true,
      message: 'Необходимы параметры поиска',
    });
  }

  try {
    const matchingNotes = await NoteModel.find({
      userId: user._id,
      $or: [
        { title: { $regex: new RegExp(query, 'i') } },
        { content: { $regex: new RegExp(query, 'i') } },
      ],
    });

    return res.json({
      error: false,
      notes: matchingNotes,
      message: 'Найдены соответствующие поисковому запросу заметки',
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Внутренняя ошибка сервера',
    });
  }
});

app.listen(PORT);

export default app;

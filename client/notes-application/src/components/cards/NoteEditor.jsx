import React, { useState } from 'react';
import TagInput from '../input/TagInput';
import { MdClose } from 'react-icons/md';
import axiosInstance from '../../utils/api';

const NoteEditor = ({ note, type, onClose, getUserNotes, handleOpenToast }) => {
  const [title, setTitle] = useState(note?.title ?? '');
  const [content, setContent] = useState(note?.content ?? '');
  const [tags, setTags] = useState(note?.tags ?? []);
  const [error, setError] = useState(null);

  const createNote = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axiosInstance.post(`/users/${userId}/notes`, {
        title,
        content,
        tags,
      });

      if (response?.data?.note) {
        handleOpenToast('add', 'Заметка успешно создана');
        getUserNotes();
        onClose();
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        setError(error.response.data.message);
      }
    }
  };

  const editNote = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axiosInstance.put(`/users/${userId}/notes/${note._id}`, {
        title,
        content,
        tags,
      });

      if (response?.data?.note) {
        handleOpenToast('edit', 'Заметка успешно изменена');
        getUserNotes();
        onClose();
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        setError(error.response.data.message);
      }
    }
  };

  const handleAddNote = () => {
    if (!title) {
      setError('Пожалуйста, добавьте заголовок');
      return;
    }

    if (!content) {
      setError('Пожалуйста, добавьте содержимое заметки');
      return;
    }

    setError('');

    if (type === 'edit') {
      editNote();
    } else {
      createNote();
    }
  };

  return (
    <div className="relative">
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50"
        onClick={onClose}
      >
        <MdClose className="text-xl text-slate-400" />
      </button>

      <div className="flex flex-col gap-2">
        <input
          type="text"
          className="text-xl text-slate-950 outline-none"
          placeholder="Заголовок"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <textarea
          type="text"
          className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
          placeholder="Содержимое"
          rows={10}
          value={content}
          onChange={({ target }) => setContent(target.value)}
        />
      </div>

      <div className="mt-3">
        <TagInput tags={tags} setTags={setTags} />
      </div>

      {error && <p className="text-red-500 text-xs pt-4">{error}</p>}

      <button className="btn-primary font-medium mt-5 p-3" onClick={handleAddNote}>
        {type === 'edit' ? 'Обновить' : 'Создать'}
      </button>
    </div>
  );
};

export default NoteEditor;

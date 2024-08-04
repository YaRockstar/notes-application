import React from 'react';
import TagInput from '../input/TagInput';

const NoteEditor = () => {
  return (
    <div>
      <div className="flex flex-col gap-2">
        <label className="input-label">ЗАГОЛОВОК</label>
        <input
          type="text"
          className="text-2xl text-slate-950 outline-none"
          placeholder="Заголовок вашей заметки"
        />
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label">СОДЕРЖИМОЕ</label>
        <textarea
          type="text"
          className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
          placeholder="Содержимое вашей заметки"
          rows={10}
        />
      </div>

      <div className="mt-3">
        <label className="input-label">ТЕГИ</label>
        <TagInput />
      </div>

      <button className="btn-primary font-medium mt-5 p-3" onClick={() => {}}>
        ДОБАВИТЬ
      </button>
    </div>
  );
};

export default NoteEditor;

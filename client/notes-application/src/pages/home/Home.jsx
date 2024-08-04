import React, { useState } from 'react';
import Navbar from '../../components/navbar/Navbar';
import NoteCard from '../../components/cards/NoteCard';
import { MdAdd, MdOutlineAddLocationAlt, MdOutlineAlarmAdd } from 'react-icons/md';
import NoteEditor from '../../components/cards/NoteEditor';
import Modal from 'react-modal';

const Home = () => {
  const [openNoteEditorModal, setOpenNoteEditorModal] = useState({
    isShown: false,
    type: 'add',
    data: null,
  });

  return (
    <>
      <Navbar />

      <div className="container mx-auto">
        <div className="grid grid-cols-3 gap-4 mt-8">
          <NoteCard
            title="Встреча с приятелями"
            date="3 сентября"
            content="Встреча в ресторане"
            tags="#встреча"
            isPinned={true}
            onEdit={() => {}}
            onDelete={() => {}}
            onPinNote={() => {}}
          />
        </div>
      </div>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-yellow-500 absolute right-10 bottom-10"
        onClick={() => {
          setOpenNoteEditorModal({ isShown: true, type: 'add', data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={openNoteEditorModal.isShown}
        onRequestClose={() => {}}
        style={{ overlay: { backgroundColor: 'rgba(0,0,0,0.2' } }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
      >
        <NoteEditor />
      </Modal>
    </>
  );
};

export default Home;

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/navbar/Navbar';
import NoteCard from '../../components/cards/NoteCard';
import { MdAdd } from 'react-icons/md';
import NoteEditor from '../../components/cards/NoteEditor';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/api';
import ToastMessage from '../../components/toastMessage/ToastMessage';
import EmptyCard from '../../components/cards/EmptyCard';
import AddNotedImage from '../../assets/images/add-notes.svg';
import NoDataImage from '../../assets/images/no-data.svg';

const Home = () => {
  const [openNoteEditorModal, setOpenNoteEditorModal] = useState({
    isShown: false,
    type: 'add',
    data: null,
  });

  const [showToastMessage, setShowToastMessage] = useState({
    isShown: false,
    type: 'add',
    message: '',
  });

  const [userInfo, setUserInfo] = useState(null);
  const [userNotes, setUserNotes] = useState([]);

  const [isSearch, setIsSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const handleEdit = note => {
    setOpenNoteEditorModal({ isShown: true, data: note, type: 'edit' });
  };

  const handleOpenToast = (type, message) => {
    setShowToastMessage({
      isShown: true,
      type,
      message,
    });
  };

  const handleCloseToast = () => {
    setShowToastMessage({
      isShown: false,
      message: '',
    });
  };

  const getUserInfo = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axiosInstance.get(`/users/${userId}`);
      if (response?.data?.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    }
  };

  const getUserNotes = async () => {
    setIsLoading(true);
    try {
      const userId = localStorage.getItem('userId');
      const response = await axiosInstance.get(`/users/${userId}/notes`);
      if (response?.data?.notes) {
        setUserNotes(response.data.notes);
      }
    } catch (error) {
      console.log('Неизвестная ошибка. Пожалуйста, попробуйте снова.');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteNode = async note => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axiosInstance.delete(`/users/${userId}/notes/${note._id}`);

      if (response?.data?.noteId) {
        handleOpenToast('delete', 'Заметка успешно удалена');
        getUserNotes();
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.log('Неизвестная ошибка. Пожалуйста, попробуйте снова.');
      }
    }
  };

  const onSearchNotes = async query => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axiosInstance.get(`/users/${userId}/notes/search`, {
        params: { query },
      });

      if (response?.data?.notes) {
        setIsSearch(true);
        setUserNotes(response.data.notes);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateNoteStatus = async note => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axiosInstance.put(`/users/${userId}/notes/${note._id}`, {
        isPinned: !note.isPinned,
      });

      if (response?.data?.note) {
        handleOpenToast('edit', 'Заметка успешно изменена');
        getUserNotes();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClearSearch = () => {
    setIsSearch(false);
    getUserNotes();
  };

  useEffect(() => {
    getUserInfo();
    getUserNotes();
    return () => {};
  }, []);

  return isLoading ? (
    <></>
  ) : (
    <>
      <Navbar
        userInfo={userInfo}
        onSearchNotes={onSearchNotes}
        handleClearSearch={handleClearSearch}
      />

      <div className="container mx-auto">
        {userNotes.length > 0 ? (
          <div className="grid grid-cols-3 gap-4 mt-8">
            {userNotes.map(note => (
              <NoteCard
                key={note._id}
                title={note.title}
                date={note.createdOn}
                content={note.content}
                tags={note.tags}
                isPinned={note.isPinned}
                onEdit={() => handleEdit(note)}
                onDelete={() => deleteNode(note)}
                onPinNote={() => updateNoteStatus(note)}
              />
            ))}
          </div>
        ) : (
          <EmptyCard
            imageSource={isSearch ? NoDataImage : AddNotedImage}
            message={
              isSearch
                ? 'По запросу ничего не найдено'
                : 'Создайте свою первую заметку! Нажмите на кнопку «Добавить»'
            }
          />
        )}
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
        style={{ overlay: { backgroundColor: 'rgba(0,0,0,0.2)' } }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
      >
        <NoteEditor
          type={openNoteEditorModal.type}
          note={openNoteEditorModal.data}
          onClose={() => {
            setOpenNoteEditorModal({ isShown: false, type: 'add', data: null });
          }}
          getUserNotes={getUserNotes}
          handleOpenToast={handleOpenToast}
        />
      </Modal>

      <ToastMessage
        isShown={showToastMessage.isShown}
        type={showToastMessage.type}
        message={showToastMessage.message}
        onClose={handleCloseToast}
      />
    </>
  );
};

export default Home;

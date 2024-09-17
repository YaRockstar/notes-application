import React, { useState } from 'react';
import Profile from '../cards/Profile';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../searchBar/SearchBar';
import AppLogo from '../../assets/images/app-logo.png';

const Navbar = ({ userInfo, onSearchNotes, handleClearSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleSearch = () => {
    if (searchQuery) {
      onSearchNotes(searchQuery);
    }
  };

  const onClearSearch = () => {
    setSearchQuery('');
    handleClearSearch();
  };

  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow">
      <h2 className="text-xl font-medium text-black py-2">
        <img
          src={AppLogo}
          alt="Заметки"
          className="w-20 sm:w-24 md:w-28 lg:w-32 h-auto"
        />
      </h2>

      <SearchBar
        value={searchQuery}
        onChange={({ target }) => {
          setSearchQuery(target.value);
        }}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
      />

      {userInfo && <Profile userInfo={userInfo} onLogout={onLogout} />}
    </div>
  );
};

export default Navbar;

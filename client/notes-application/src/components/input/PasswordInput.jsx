import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';

const PasswordInput = ({ value, onChange, placeholder }) => {
  const [isShownPassword, setIsShownPassword] = useState(false);

  const toggleShownPassword = () => {
    setIsShownPassword(!isShownPassword);
  };

  return (
    <div className="flex items-center bg-transparent border-[1.5px] px-5 rounded mb-3">
      <input
        value={value}
        onChange={onChange}
        type={isShownPassword ? 'text' : 'password'}
        placeholder={placeholder || 'Пароль'}
        className="w-full text-sm bg-transparent py-3 mr-3 rounded outline-none"
      />

      {isShownPassword ? (
        <FaRegEye
          size={22}
          className="text-primary cursor-pointer"
          onClick={() => toggleShownPassword()}
        />
      ) : (
        <FaRegEyeSlash
          size={22}
          className="text-state-400 cursor-pointer"
          onClick={() => toggleShownPassword()}
        />
      )}
    </div>
  );
};

export default PasswordInput;

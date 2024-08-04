import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/navbar/Navbar';
import PasswordInput from '../../components/input/PasswordInput';
import { validateEmail } from '../../utils/validator';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSignup = async event => {
    event.preventDefault();

    if (!name) {
      setError('Пожалуйста, введите имя пользователя');
      return;
    }

    if (!validateEmail(email.trim())) {
      setError('Пожалуйста, введите корректный адрес электронной почты');
      return;
    }

    if (!password) {
      setError('Пожалуйста, введите пароль');
      return;
    }

    setError('');
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center mt-28">
        <div className="w-96 border rounded bg-white px-7 py-10">
          <form onSubmit={handleSignup}>
            <h4 className="text-2xl mb-7">Регистрация</h4>

            <input
              type="text"
              placeholder="Имя пользователя"
              className="input-box"
              value={name}
              onChange={event => setName(event.target.value)}
            />

            <input
              type="text"
              placeholder="Почта"
              className="input-box"
              value={email}
              onChange={event => setEmail(event.target.value)}
            />

            <PasswordInput
              value={password}
              onChange={event => setPassword(event.target.value)}
            />

            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

            <button type="submit" className="btn-primary">
              Создать аккаунт
            </button>

            <p className="text-sm text-center mt-4">
              Уже есть аккаунт?{' '}
              <Link to="/login" className="font-medium text-primary underline">
                Войти
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;

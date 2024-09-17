import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PasswordInput from '../../components/input/PasswordInput';
import Navbar from '../../components/navbar/Navbar';
import { validateEmail } from '../../utils/utils';
import axiosInstance from '../../utils/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async event => {
    event.preventDefault();

    if (!validateEmail(email.trim())) {
      setError('Пожалуйста, введите корректный адрес электронной почты');
      return;
    }

    if (!password) {
      setError('Пожалуйста, введите пароль');
      return;
    }

    setError('');

    try {
      const response = await axiosInstance.post('/login', {
        email,
        password,
      });

      if (response?.data?.accessToken && response?.data?.user?._id) {
        localStorage.setItem('token', response.data.accessToken);
        localStorage.setItem('userId', response.data.user._id);
        navigate('/home');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Неизвестная ошибка. Пожалуйста, попробуйте снова.');
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center mt-28">
        <div className="w-96 border rounded bg-white px-7 py-10">
          <form onSubmit={handleLogin}>
            <h4 className="text-2xl mb-7">Вход в аккаунт</h4>

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
              Войти
            </button>

            <p className="text-sm text-center mt-4">
              Еще не зарегистрированы?{' '}
              <Link to="/signup" className="font-medium text-primary underline">
                Регистрация
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;

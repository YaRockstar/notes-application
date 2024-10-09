const requestError = {
  BAD_REQUEST: {
    message: 'Неверный запрос',
    status: 400,
  },

  UNAUTHORIZED: {
    message: 'Пользователь не авторизован',
    status: 401,
  },

  FORBIDDEN: {
    message: 'Доступ запрещен',
    status: 403,
  },

  NOT_FOUND: {
    message: 'Не найдено',
    status: 404,
  },

  INTERNAL_SERVER_ERROR: {
    message: 'Внутренняя ошибка сервера',
    status: 500,
  },
};

export default requestError;

import bcrypt from 'bcrypt';
import RequestError from '../constants/errors.js';
import { createAccessToken } from '../utils/authUtil.js';
import { userModel } from '../models/UserModel.js';

class UserController {
  /**
   * Вход в аккаунт.
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async login(req, res) {
    const { email, password } = req.body;

    if (!email) {
      return res.status(RequestError.BAD_REQUEST.status).json({
        error: true,
        message: `${RequestError.BAD_REQUEST.message}: необходима почта`,
      });
    }

    if (!password) {
      return res.status(RequestError.BAD_REQUEST.status).json({
        error: true,
        message: `${RequestError.BAD_REQUEST.message}: необходим пароль`,
      });
    }

    try {
      const user = await userModel.findByEmail(email);

      if (!user) {
        return res.status(RequestError.BAD_REQUEST.status).json({
          error: true,
          message: `${RequestError.BAD_REQUEST.message}: невалидные данные для входа`,
        });
      }

      const isNotValidPassword = !bcrypt.compareSync(password, user.password);

      if (isNotValidPassword) {
        return res.status(RequestError.BAD_REQUEST.status).json({
          error: true,
          message: `${RequestError.BAD_REQUEST.message}: невалидные данные для входа`,
        });
      }

      const simplifiedUser = UserController.#simplifyUser(user);

      return res.json({
        error: false,
        user: simplifiedUser,
        accessToken: createAccessToken(simplifiedUser),
        message: 'Успешный вход',
      });
    } catch (error) {
      return res.status(RequestError.INTERNAL_SERVER_ERROR.status).json({
        error: true,
        message: RequestError.INTERNAL_SERVER_ERROR.message,
      });
    }
  }

  /**
   * Создание пользователя.
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async createUser(req, res) {
    const { email, password, fullName } = req.body;

    if (!email) {
      return res.status(RequestError.BAD_REQUEST.status).json({
        error: true,
        message: `${RequestError.BAD_REQUEST.message}: необходима почта`,
      });
    }

    if (!password) {
      return res.status(RequestError.BAD_REQUEST.status).json({
        error: true,
        message: `${RequestError.BAD_REQUEST.message}: необходим пароль`,
      });
    }

    if (!fullName) {
      return res.status(RequestError.BAD_REQUEST.status).json({
        error: true,
        message: `${RequestError.BAD_REQUEST.message}: необходимо полное имя`,
      });
    }

    const existingUser = await userModel.findByEmail(email);

    if (existingUser) {
      return res.status(RequestError.BAD_REQUEST.status).json({
        error: true,
        message: `${RequestError.BAD_REQUEST.message}: пользователь уже существует`,
      });
    }

    try {
      const hashPassword = await bcrypt.hash(password, 5);

      const user = await userModel.createUser({
        email,
        password: hashPassword,
        fullName,
      });

      const simplifiedUser = UserController.#simplifyUser(user);

      return res.json({
        error: false,
        user: simplifiedUser,
        accessToken: createAccessToken(simplifiedUser),
        message: 'Регистрация прошла успешно',
      });
    } catch (error) {
      return res.status(RequestError.INTERNAL_SERVER_ERROR.status).json({
        error: true,
        message: RequestError.INTERNAL_SERVER_ERROR.message,
      });
    }
  }

  /**
   * Получение данных пользователя.
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async getUserData(req, res) {
    const userId = req.params.userId;

    if (req?.user?._id !== userId) {
      return res.sendStatus(RequestError.FORBIDDEN.status);
    }

    try {
      const user = await userModel.findById(userId);

      if (!user) {
        return res.sendStatus(RequestError.UNAUTHORIZED.status);
      }

      return res.json({
        error: false,
        user: UserController.#simplifyUser(user),
        message: 'Возвращен пользователь',
      });
    } catch (error) {
      return res.status(RequestError.INTERNAL_SERVER_ERROR.status).json({
        error: true,
        message: RequestError.INTERNAL_SERVER_ERROR.message,
      });
    }
  }

  /**
   * Убирает лишние данные о пользователе.
   * @param {*} user пользователь
   * @returns
   */
  static #simplifyUser(user) {
    return {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
    };
  }
}

export default new UserController();

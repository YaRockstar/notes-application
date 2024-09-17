import moment from 'moment-timezone';

/**
 * Валидация почты (проверка строки на то, что она является почтой).
 * @param {*} email строка
 * @returns валидная ли почта
 */
export const validateEmail = email => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Форматирование даты в более привычный формат с учетом московского времени.
 * @param {*} isoDate дата в виде строки в формате ISO
 * @returns отформатированная дата
 */
export const formatNoteDate = isoDate => {
  const moscowDate = moment().tz(isoDate, 'Europe/Moscow');
  return moscowDate.format('DD-MM-YYYY');
};

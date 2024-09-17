import moment from 'moment-timezone';

export const validateEmail = email => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const formatNoteDate = isoDate => {
  const moscowDate = moment().tz(isoDate, 'Europe/Moscow');
  return moscowDate.format('DD-MM-YYYY');
};

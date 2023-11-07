/**
 * Check the token is expired or not
 * @param {number} dateTime - The datetime to check
 * @return {Boolean}
 */
export const isExpired = (exp) => {
  // Convert to timestamp milliseconds

  let now = Date.now();

  // exp < now => Expired!

  return exp * 1000 < now;
};

export const convertTime = (dateTime) => {
  const date = new Date(dateTime);

  const addLeadingZero = (num) => (num < 10 ? `0${num}` : num);

  const hour = addLeadingZero(date.getHours());
  const minute = addLeadingZero(date.getMinutes());
  const second = addLeadingZero(date.getSeconds());
  const day = addLeadingZero(date.getUTCDate());
  const month = addLeadingZero(date.getMonth() + 1); // Tháng bắt đầu từ 0
  const year = date.getFullYear();

  return `${hour}:${minute}:${second} ${day}/${month}/${year}`;
};

export const roundNumber = (number) => {
  const roundedNumber = Math.round(number * 10) / 10;

  return roundedNumber;
};

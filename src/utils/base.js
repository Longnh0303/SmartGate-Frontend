/**
 * Check the token is expired or not
 * @param {number} dateTime - The datetime to check
 * @return {Boolean}
 */
export const isExpired = exp => {
  // Convert to timestamp milliseconds

  let now = Date.now()

  // exp < now => Expired!

  return exp * 1000 < now
}

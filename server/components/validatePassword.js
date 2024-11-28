function validatePassword(password) {
  const MIN_LENGTH = 8;
  const allowedSpecialCharacters = "!@#$%^&*()_+-=[]{}|;':\",.<>?/";

  if (password.length < MIN_LENGTH) {
    return {
      valid: false,
      message: `Password must be at least ${MIN_LENGTH} characters long.`,
    };
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecialChar = new RegExp(
    `[${escapeRegExp(allowedSpecialCharacters)}]`
  ).test(password);

  for (let char of password) {
    if (
      !char.match(/[A-Za-z0-9]/) &&
      !allowedSpecialCharacters.includes(char)
    ) {
      return { valid: false, message: `Character "${char}" is not allowed.` };
    }
  }

  if (!hasUpperCase)
    return {
      valid: false,
      message: "Password must contain at least one uppercase letter.",
    };
  if (!hasLowerCase)
    return {
      valid: false,
      message: "Password must contain at least one lowercase letter.",
    };
  if (!hasDigit)
    return {
      valid: false,
      message: "Password must contain at least one digit.",
    };
  if (!hasSpecialChar)
    return {
      valid: false,
      message: "Password must contain at least one special character.",
    };

  return { valid: true, message: "Password is accepted." };
}

module.exports = validatePassword;

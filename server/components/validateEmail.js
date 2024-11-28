function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(email)) {
    return { valid: false, message: "The email provided is invalid." };
  }

  return { valid: true, message: "Email is valid." };
}

module.exports = validateEmail;

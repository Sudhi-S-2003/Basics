// utils/errors.js
 const throwError = (name, message, details = null) => {
  const err = new Error(message);
  err.name = name;
  err.details = details;
  throw err;
};
export default throwError
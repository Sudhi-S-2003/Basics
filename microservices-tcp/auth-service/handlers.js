const jwt = require('jsonwebtoken');

const JWT_SECRET = 'hardcoded_secret_for_demo_please_change';
const TOKEN_EXPIRES_IN = '1h';

// in-memory users: { email: { id, email, password } }
const users = {};
let nextId = 1;

function register({ email, password }) {
  if (!email || !password) {
    return { status: 'error', message: 'email and password required' };
  }
  if (users[email]) {
    return { status: 'error', message: 'user already exists' };
  }
  const user = { id: String(nextId++), email, password };
  users[email] = user;
  const safe = { id: user.id, email: user.email };
  return { status: 'ok', data: safe };
}

function login({ email, password }) {
  if (!email || !password) {
    return { status: 'error', message: 'email and password required' };
  }
  const user = users[email];
  if (!user || user.password !== password) {
    return { status: 'error', message: 'invalid credentials' };
  }
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });
  return { status: 'ok', data: { token } };
}

function verify_token({ token }) {
  if (!token) {
    return { status: 'error', message: 'token required' };
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    // return basic user info
    return { status: 'ok', data: { id: payload.id, email: payload.email } };
  } catch (err) {
    return { status: 'error', message: 'invalid or expired token' };
  }
}

module.exports = {
  handlers: {
    register: (payload) => register(payload),
    login: (payload) => login(payload),
    verify_token: (payload) => verify_token(payload),
  }
};

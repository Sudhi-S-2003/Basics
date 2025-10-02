const { sendTcpRequest } = require('./tcpClient');

const AUTH_HOST = '127.0.0.1';
const AUTH_PORT = 4000;

// in-memory products: id -> { id, name, price }
const products = {};
let nextId = 1;

async function verifyToken(token) {
  const req = { action: 'verify_token', payload: { token } };
  const resp = await sendTcpRequest(AUTH_PORT, AUTH_HOST, req);
  return resp;
}

async function create({ name, price, token }) {
  if (!token) return { status: 'error', message: 'token required' };
  const valid = await verifyToken(token);
  if (valid.status !== 'ok') return { status: 'error', message: 'unauthorized' };

  if (!name || typeof price === 'undefined') return { status: 'error', message: 'name and price required' };
  const id = String(nextId++);
  products[id] = { id, name, price };
  return { status: 'ok', data: products[id] };
}

async function view({ id, token }) {
  if (!token) return { status: 'error', message: 'token required' };
  const valid = await verifyToken(token);
  if (valid.status !== 'ok') return { status: 'error', message: 'unauthorized' };

  const p = products[id];
  if (!p) return { status: 'error', message: 'product not found' };
  return { status: 'ok', data: p };
}

async function view_all({ token }) {
  if (!token) return { status: 'error', message: 'token required' };
  const valid = await verifyToken(token);
  if (valid.status !== 'ok') return { status: 'error', message: 'unauthorized' };

  const all = Object.values(products);
  return { status: 'ok', data: all };
}

module.exports = { handlers: { create, view, view_all } };

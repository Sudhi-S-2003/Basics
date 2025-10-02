const { sendTcpRequest } = require('./tcpClient');

const AUTH_HOST = '127.0.0.1';
const AUTH_PORT = 4000;
const PRODUCT_HOST = '127.0.0.1';
const PRODUCT_PORT = 6000;

// in-memory orders: array
const orders = [];
let nextId = 1;

async function verifyToken(token) {
  const req = { action: 'verify_token', payload: { token } };
  return sendTcpRequest(AUTH_PORT, AUTH_HOST, req);
}

async function checkProduct(productId, token) {
  // call product service view to confirm product exists; product view will itself verify token with auth
  const req = { action: 'view', payload: { id: productId, token } };
  return sendTcpRequest(PRODUCT_PORT, PRODUCT_HOST, req);
}

async function create_order({ product_id, qty, token }) {
  if (!token) return { status: 'error', message: 'token required' };
  const v = await verifyToken(token);
  if (v.status !== 'ok') return { status: 'error', message: 'unauthorized' };

  if (!product_id || !qty) return { status: 'error', message: 'product_id and qty required' };

  // check product exists
  const p = await checkProduct(product_id, token);
  if (p.status !== 'ok') return { status: 'error', message: 'product not found or unauthorized' };

  const order = { id: String(nextId++), product: p.data, qty, user: v.data, createdAt: new Date().toISOString() };
  orders.push(order);
  return { status: 'ok', data: order };
}

async function get_orders({ token }) {
  if (!token) return { status: 'error', message: 'token required' };
  const v = await verifyToken(token);
  if (v.status !== 'ok') return { status: 'error', message: 'unauthorized' };

  // For demo: return all orders (no per-user filtering)
  return { status: 'ok', data: orders };
}

module.exports = { handlers: { create_order, get_orders } };

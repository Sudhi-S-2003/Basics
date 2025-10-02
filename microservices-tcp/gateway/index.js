const express = require('express');
const bodyParser = require('body-parser');
const { sendTcpRequest } = require('./tcpClient');

const app = express();
app.use(bodyParser.json());

const AUTH_HOST = '127.0.0.1';
const AUTH_PORT = 4000;
const ORDER_HOST = '127.0.0.1';
const ORDER_PORT = 5000;
const PRODUCT_HOST = '127.0.0.1';
const PRODUCT_PORT = 6000;

function extractTokenFromHeader(req) {
  const h = req.headers['authorization'] || req.headers['Authorization'];
  if (!h) return null;
  const parts = h.split(' ');
  if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') return parts[1];
  return null;
}

// helper to forward TCP messages
async function tcpCall(port, host, action, payload) {
  const req = { action, payload };
  return sendTcpRequest(port, host, req);
}

/* AUTH routes */
app.post('/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const resp = await tcpCall(AUTH_PORT, AUTH_HOST, 'register', { email, password });
    if (resp.status === 'ok') return res.json(resp.data);
    return res.status(400).json({ error: resp.message });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const resp = await tcpCall(AUTH_PORT, AUTH_HOST, 'login', { email, password });
    if (resp.status === 'ok') return res.json(resp.data);
    return res.status(400).json({ error: resp.message });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/* PRODUCT routes */
app.post('/products/create', async (req, res) => {
  try {
    const token = extractTokenFromHeader(req);
    const { name, price } = req.body;
    const resp = await tcpCall(PRODUCT_PORT, PRODUCT_HOST, 'create', { name, price, token });
    if (resp.status === 'ok') return res.json(resp.data);
    return res.status(400).json({ error: resp.message });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.get('/products/view/:id', async (req, res) => {
  try {
    const token = extractTokenFromHeader(req);
    const id = req.params.id;
    const resp = await tcpCall(PRODUCT_PORT, PRODUCT_HOST, 'view', { id, token });
    if (resp.status === 'ok') return res.json(resp.data);
    return res.status(404).json({ error: resp.message });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.get('/products/view_all', async (req, res) => {
  try {
    const token = extractTokenFromHeader(req);
    const resp = await tcpCall(PRODUCT_PORT, PRODUCT_HOST, 'view_all', { token });
    if (resp.status === 'ok') return res.json(resp.data);
    return res.status(400).json({ error: resp.message });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/* ORDER routes */
app.post('/orders/create', async (req, res) => {
  try {
    const token = extractTokenFromHeader(req);
    const { product_id, qty } = req.body;
    const resp = await tcpCall(ORDER_PORT, ORDER_HOST, 'create_order', { product_id, qty, token });
    if (resp.status === 'ok') return res.json(resp.data);
    return res.status(400).json({ error: resp.message });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.get('/orders', async (req, res) => {
  try {
    const token = extractTokenFromHeader(req);
    const resp = await tcpCall(ORDER_PORT, ORDER_HOST, 'get_orders', { token });
    if (resp.status === 'ok') return res.json(resp.data);
    return res.status(400).json({ error: resp.message });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Gateway (HTTP) listening on http://localhost:${PORT}`);
});

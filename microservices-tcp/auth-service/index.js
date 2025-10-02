const net = require('net');
const { handlers } = require('./handlers');

const PORT = 4000;

const server = net.createServer((socket) => {
  let dataBuffer = '';

  socket.on('data', (chunk) => {
    dataBuffer += chunk.toString();
    // try parse when data arrives (single-request/single-response model)
    try {
      const req = JSON.parse(dataBuffer);
      dataBuffer = '';
      const { action, payload } = req || {};
      if (!action) {
        socket.write(JSON.stringify({ status: 'error', message: 'action required' }));
        socket.end();
        return;
      }
      const handler = handlers[action];
      if (!handler) {
        socket.write(JSON.stringify({ status: 'error', message: `unknown action ${action}` }));
        socket.end();
        return;
      }
      try {
        const res = handler(payload || {});
        socket.write(JSON.stringify(res));
      } catch (err) {
        socket.write(JSON.stringify({ status: 'error', message: 'handler error' }));
      }
      socket.end();
    } catch (err) {
      // wait for full JSON if parse failed
    }
  });

  socket.on('error', (err) => {
    // ignore/log
    console.error('auth socket error', err.message);
  });
});

server.listen(PORT, () => {
  console.log(`Auth Service (TCP) listening on port ${PORT}`);
});

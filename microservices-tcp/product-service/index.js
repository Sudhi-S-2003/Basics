const net = require('net');
const { handlers } = require('./handlers');

const PORT = 6000;

const server = net.createServer((socket) => {
  let dataBuffer = '';
  socket.on('data', async (chunk) => {
    dataBuffer += chunk.toString();
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
        const res = await handler(payload || {});
        socket.write(JSON.stringify(res));
      } catch (err) {
        console.error('product handler error', err);
        socket.write(JSON.stringify({ status: 'error', message: 'handler error' }));
      }
      socket.end();
    } catch (err) {
      // wait for more data
    }
  });

  socket.on('error', (err) => {
    console.error('product socket error', err.message);
  });
});

server.listen(PORT, () => {
  console.log(`Product Service (TCP) listening on port ${PORT}`);
});

const net = require('net');

function sendTcpRequest(port, host, message, timeout = 4000) {
  return new Promise((resolve, reject) => {
    const socket = new net.Socket();
    let buffer = '';

    const onError = (err) => {
      cleanup();
      reject(err);
    };

    const cleanup = () => {
      socket.removeAllListeners();
      try { socket.destroy(); } catch(e){}
    };

    socket.setTimeout(timeout, () => {
      cleanup();
      reject(new Error('TCP request timeout'));
    });

    socket.connect(port, host, () => {
      socket.write(JSON.stringify(message));
    });

    socket.on('data', (chunk) => {
      buffer += chunk.toString();
    });

    socket.on('end', () => {
      cleanup();
      try {
        const parsed = JSON.parse(buffer || '{}');
        resolve(parsed);
      } catch (err) {
        reject(new Error('Invalid JSON from server'));
      }
    });

    socket.on('error', onError);
  });
}

module.exports = { sendTcpRequest };

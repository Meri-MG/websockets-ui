import { httpServer } from './src/http_server/index.js';
import { WebSocketServer } from 'ws';

import { registerPlayer } from './src/websocket/handlers/reg.js';
import { handleCreateRoom } from './src/websocket/handlers/createRoom.js';

const HTTP_PORT = 3000;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const wss = new WebSocketServer({ server: httpServer });

const store = {
  players: new Map(),
  rooms: new Map(),
  games: new Map(),
};

wss.on('connection', (ws) => {
  console.log('New player connected!');

  ws.on('message', (message) => {
    console.log('Received:', message.toString());

    let payload;
    try {
      payload = JSON.parse(message);
    } catch (e) {
      console.error('Invalid JSON:', e);
      return;
    }

    let data;
    try {
      data = typeof payload.data === 'string' ? JSON.parse(payload.data) : payload.data;
    } catch (e) {
      console.error('Failed to parse payload.data:', e);
      data = {};
    }

    const type = payload.type;

    switch (type) {
      case 'reg':
        registerPlayer(ws, data, store);
        break;

      default:
        console.warn(`Unknown type: ${type}`);
    }
  });

  ws.on('close', () => {
    console.log('Player disconnected');
  });
});

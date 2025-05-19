import { httpServer } from './src/http_server/index.js';
import { WebSocketServer } from 'ws';
import { registerPlayer } from './src/websocket/handlers/reg.js';
import { handleCreateRoom } from './src/websocket/handlers/createRoom.js';
import { findPlayerByWS } from './src/utils/playerUtils.js';
import { handleAddUserToRoom } from './src/websocket/handlers/addUserToRoom.js';
import { handleAddShips } from './src/websocket/handlers/addShips.js';

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
      if (typeof payload.data === 'string' && payload.data.trim() !== '') {
        data = JSON.parse(payload.data);
      } else {
        data = payload.data || {};
      }
    } catch (e) {
      console.error('Failed to parse payload.data:', e);
      data = {};
    }

    const type = payload.type;

    switch (type) {
      case 'reg':
        registerPlayer(ws, data, store);
        break;
      case "create_room": {
        const player = findPlayerByWS(ws, store);
        if (!player) {
          ws.send(JSON.stringify({
            type: 'create_room',
            data: JSON.stringify({
              error: true,
              errorText: 'Player not found. Please register first.',
            }),
            id: 0
          }));
          return;
        }
        handleCreateRoom(ws, store, player.name, player.index);
        break;
      }

      case "add_user_to_room": {
        const player = findPlayerByWS(ws, store);
        if (!player) {
          ws.send(JSON.stringify({
            type: 'create_room',
            data: JSON.stringify({
              error: true,
              errorText: 'Player not found. Please register first.',
            }),
            id: 0
          }));
          return;
        }
        handleAddUserToRoom(ws, store, data.indexRoom, player.name, player.index);
        break;
      }

      case "add_ships":
        handleAddShips(ws, store, data);
        break;
      default:
        console.warn(`Unknown type: ${type}`);
    }
  });

  ws.on('close', () => {
    console.log('Player disconnected');
  });
});

import { broadcastRooms } from "./updateRoom.js";
let gameIdCounter = 0;

export function handleAddUserToRoom(ws, store, indexRoom, playerName, playerIndex) {
  const room = store.rooms.get(indexRoom);
  if (!room) return;

  room.roomUsers.push({ name: playerName, index: playerIndex, ws });

  store.rooms.delete(indexRoom);

  const gameId = `game-${gameIdCounter++}`;
  const playerIds = room.roomUsers.map((_, i) => `${gameId}-p${i}`);

  room.roomUsers.forEach((player, i) => {
    player.ws.send(JSON.stringify({
      type: "create_game",
      data: JSON.stringify({
        idGame: gameId,
        idPlayer: playerIds[i],
      }),
      id: 0,
    }));
  });

  store.games.set(gameId, {
    id: gameId,
    players: room.roomUsers.map((p, i) => ({
      ...p,
      idPlayer: playerIds[i],
    })),
  });

  broadcastRooms(store);
}

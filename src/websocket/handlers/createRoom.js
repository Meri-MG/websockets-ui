import { broadcastRooms } from "./updateRoom.js";

let roomIdCounter = 0;

export function handleCreateRoom(ws, store, playerName, playerIndex) {
  const roomId = `room-${roomIdCounter++}`;
  const room = {
    roomId,
    roomUsers: [{ name: playerName, index: playerIndex, ws }],
  };

  store.rooms.set(roomId, room);

  broadcastRooms(store);

  return room;
}

export function broadcastRooms(store) {
  const roomsData = Array.from(store.rooms.values())
    .filter((room) => room.roomUsers.length === 1)
    .map((room) => ({
      roomId: room.roomId,
      roomUsers: room.roomUsers.map(({ name, index }) => ({ name, index })),
    }));

  const msg = JSON.stringify({
    type: "update_room",
    data: JSON.stringify(roomsData),
    id: 0,
  });

  for (const player of store.players.values()) {
    player.ws.send(msg);
  }
}

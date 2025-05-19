export function findPlayerByWS(ws, store) {
  for (const [name, player] of store.players.entries()) {
    if (player.ws === ws) {
      return { name, ...player };
    }
  }
  return null;
}

export function sendError(ws, type, errorText) {
  ws.send(JSON.stringify({
    type,
    data: JSON.stringify({
      error: true,
      errorText,
    }),
    id: 0,
  }));
}
export function findPlayerByWS(ws, store) {
  for (const [name, player] of store.players.entries()) {
    if (player.ws === ws) {
      return { name, ...player };
    }
  }
  return null;
}
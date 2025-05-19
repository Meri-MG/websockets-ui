export function handleAddShips(ws, store, payload) {
  const { gameId, ships, indexPlayer } = payload;
  const game = store.games.get(gameId);

  if (!game) return sendError(ws, "add_ships", "Game not found.");
  const player = game.players.find(p => p.index === indexPlayer);

  if (!player) return sendError(ws, "add_ships", "Player not found in game.");

  player.ships = ships;

  ws.send(JSON.stringify({
    type: "add_ships",
    data: JSON.stringify({
      success: true,
      message: "Ships placed successfully.",
    }),
    id: 0,
  }));

  const allReady = game.players.every(p => p.ships && p.ships.length > 0);

  if (allReady) {
    game.players.forEach((p) => {
      p.ws.send(JSON.stringify({
        type: "start_game",
        data: {
          ships: p.ships,
          currentPlayerIndex: indexPlayer,
        },
        id: 0,
      }));
    });
  }
}

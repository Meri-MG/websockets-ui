const players = new Map(); // store { name, password, ws }

export function registerPlayer(ws, data) {
  const { name, password } = data;

  if (!name || !password) {
    ws.send(JSON.stringify({
      type: 'reg',
      data: JSON.stringify({
        name,
        index: null,
        error: true,
        errorText: 'Name and password required',
      }),
      id: 0
    }));
    return;
  }

  if (!players.has(name)) {
    players.set(name, { password, ws, index: players.size });
  }

  const index = players.get(name).index;

  ws.send(JSON.stringify({
    type: 'reg',
    data: JSON.stringify({
      name,
      index,
      error: false,
      errorText: '',
    }),
    id: 0
  }));
}

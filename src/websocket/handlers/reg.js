export function registerPlayer(ws, data, store) {
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

  if (!store.players.has(name)) {
    store.players.set(name, { password, ws, index: store.players.size });
  }

  const index = store.players.get(name).index;

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

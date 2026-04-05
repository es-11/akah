import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_URL,
});

const WS_BASE = import.meta.env.VITE_WS_URL || API_URL;
const WS_URL = (WS_BASE || window.location.origin).replace(/^http/i, 'ws') + '/ws';

const listenersByEvent = new Map();

let ws;
let reconnectTimer;

const connect = () => {
  if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) return;

  ws = new WebSocket(WS_URL);

  ws.addEventListener('message', (event) => {
    let payload;
    try {
      payload = JSON.parse(event.data);
    } catch {
      return;
    }
    const { type, data } = payload || {};
    if (!type) return;
    const listeners = listenersByEvent.get(type);
    if (!listeners) return;
    for (const cb of listeners) {
      try {
        cb(data);
      } catch {
      }
    }
  });

  ws.addEventListener('close', () => {
    if (reconnectTimer) return;
    reconnectTimer = setTimeout(() => {
      reconnectTimer = undefined;
      connect();
    }, 1000);
  });
};

const socket = {
  on(event, cb) {
    if (!listenersByEvent.has(event)) listenersByEvent.set(event, new Set());
    listenersByEvent.get(event).add(cb);
    connect();
  },
  off(event, cb) {
    const listeners = listenersByEvent.get(event);
    if (!listeners) return;
    if (cb) listeners.delete(cb);
    else listeners.clear();
  },
};

export { api, socket, API_URL };

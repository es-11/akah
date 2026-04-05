import axios from 'axios';
import { io } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_URL,
});

const socket = io(API_URL, {
  path: '/socket.io',
  transports: ['websocket', 'polling'],
});

export { api, socket, API_URL };

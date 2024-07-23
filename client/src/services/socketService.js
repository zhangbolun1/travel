import io from 'socket.io-client';

const socket = io('http://localhost:5100', {
  transports: ['websocket', 'polling'],
  withCredentials: true
});

export default socket;
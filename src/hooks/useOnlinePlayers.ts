import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';

interface OnlinePlayer {
  socketId: string;
  name: string;
  balance: number;
}

export const useOnlinePlayers = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [onlinePlayers, setOnlinePlayers] = useState<OnlinePlayer[]>([]);
  const [mySocketId, setMySocketId] = useState('');

  useEffect(() => {
    console.log('🔌 Initializing socket connection...');
    const newSocket = io(SERVER_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('✅ Connected to server:', newSocket.id);
      setConnected(true);
      setMySocketId(newSocket.id || '');
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Disconnected from server');
      setConnected(false);
    });

    newSocket.on('onlinePlayersUpdate', ({ players }: { players: OnlinePlayer[] }) => {
      console.log('📥 Received online players:', players);
      setOnlinePlayers(players || []);
    });

    return () => {
      console.log('🔌 Cleaning up socket connection');
      newSocket.close();
    };
  }, []);

  const setPlayerName = (name: string) => {
    if (socket && connected) {
      console.log('📤 Setting player name:', name);
      socket.emit('setPlayerName', { name });
    }
  };

  return {
    connected,
    onlinePlayers,
    mySocketId,
    setPlayerName,
  };
};

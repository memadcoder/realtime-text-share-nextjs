'use client';
import React, { createContext, useState, useEffect } from 'react';

interface Socket {
	send: (data: string) => void;
	onmessage: (event: MessageEvent) => void;
}

interface SocketContextValue {
	socket: Socket | null;
}

export const SocketContext = createContext<SocketContextValue>({
	socket: null
});

interface SocketProviderProps {
	children: React.ReactElement;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
	const [socket, setSocket] = useState<Socket | null>(null);

	useEffect(() => {
		const newSocket = new WebSocket('ws://localhost:3000');
		setSocket(newSocket as Socket);
	}, []);

	return (
		<SocketContext.Provider value={{ socket }}>
			{children}
		</SocketContext.Provider>
	);
};

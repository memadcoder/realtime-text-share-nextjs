'use client';
import React, { useState, useEffect } from 'react';
import { Textarea, Grid, useInput, Spacer, Button } from '@nextui-org/react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

export default function TextEditor() {
	const [message, setMessage] = useState('');
	const [messages, setMessages] = useState([]);
	let roomName = 'testRoomName';

	console.log('received herer');
	socket.on('connect', () => {
		console.log('Connected');
		socket.emit('joinRoom', roomName);
	});

	socket.on('newuser', (data) => {
		console.log(data);
	});

	socket.on('newcontent', (data) => {
		console.log(data);
	});

	socket.on('disconnect', function () {
		console.log('Disconnected');
	});

	const handleSubmit = (event: any) => {
		socket.emit('shareContent', {
			text: 'This is the textcontent',
			roomName: roomName
		});
	};

	// Controlled
	const {
		value: controlledValue,
		setValue: setControlledValue,
		reset,
		bindings
	} = useInput('Input Text and Share with all....');

	// Uncontrolled
	const textareaRef = React.useRef(null);
	const onPress = () => {
		if (textareaRef.current) {
			textareaRef.current.value = Math.random().toString(32);
		}
	};
	return (
		<div style={{ margin: '10px' }}>
			<Grid.Container gap={1} justify={'center'}>
				<Grid xs={12}>
					<Textarea
						{...bindings}
						fullWidth
						minRows={100}
						maxRows={30}
					/>
				</Grid>

				<Grid>
					<Button
						auto
						color="primary"
						size="sm"
						onPress={() => handleSubmit(Math.random().toString(32))}
					>
						Share Content
					</Button>
				</Grid>
			</Grid.Container>
		</div>
	);
}

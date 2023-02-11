'use client';
import React, { useState, useEffect } from 'react';
import { Textarea, Grid, useInput, Spacer, Button } from '@nextui-org/react';
import io from 'socket.io-client';
import { useSearchParams } from 'next/navigation';

const socket = io('http://localhost:3000');

export default function TextEditor() {
	const searchParams = useSearchParams();
	const room = searchParams.get('room');

	const [roomName, setRoomName] = useState(
		room || Math.random().toString(32)
	);
	useEffect(() => {
		socket.emit('joinRoom', roomName);

		socket.on('newcontent', (data) => {
			textareaRef.current.value = data.text;
		});

		socket.on('disconnect', function () {
			console.log('Disconnected');
		});

		return () => {
			socket.off('connect');
			socket.off('newcontent');
			socket.off('disconnect');
		};
	}, []);

	// Controlled
	const {
		value: controlledValue,
		setValue: setControlledValue,
		reset,
		bindings
	} = useInput('Enter your content here...');

	// Uncontrolled
	const textareaRef = React.useRef(null);

	const handleSubmit = () => {
		let content = '';
		if (textareaRef.current) {
			content = textareaRef.current.value;
		}

		socket.emit('shareContent', {
			text: content,
			roomName: roomName
		});
	};

	return (
		<div style={{ margin: '10px' }}>
			<Grid.Container gap={1} justify={'center'}>
				<Grid xs={12}>
					<Textarea
						{...bindings}
						ref={textareaRef}
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
						onPress={() => handleSubmit()}
					>
						BroadCast Message
					</Button>
				</Grid>
			</Grid.Container>
		</div>
	);
}

import React, { useState } from 'react';
import { Box, Text, useInput, useApp } from 'ink';

export default function App(): React.JSX.Element {
	const { exit } = useApp();
	const [input, setInput] = useState<string>('');

	useInput((char: string, key) => {
		if (key.escape || (key.ctrl && char === 'c')) {
			exit();
			return;
		}

		if (key.backspace || key.delete) {
			setInput(prev => prev.slice(0, -1));
			return;
		}

		if (key.return) {
			setInput('');
			return;
		}

		if (char) {
			setInput(prev => prev + char);
		}
	});

	return (
		<Box flexDirection="column" padding={1}>
			<Box marginBottom={1}>
				<Text bold color="cyan">UBER CLI</Text>
			</Box>

			<Box>
				<Text color="green">{'> '}</Text>
				<Text>{input}</Text>
				<Text color="gray">█</Text>
			</Box>

			<Box marginTop={1}>
				<Text dimColor>ESC or Ctrl+C to exit</Text>
			</Box>
		</Box>
	);
}

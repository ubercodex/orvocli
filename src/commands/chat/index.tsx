import React, { useState, useCallback } from 'react';
import { Box, Text, useInput } from 'ink';
import { streamText, stepCountIs } from 'ai';
import { useTheme } from '../../context/ThemeContext.js';
import ChatMessage, { type ChatMessageData } from '../../components/ChatMessage.js';
import CommandPalette, { PALETTE_ITEMS } from '../../components/CommandPalette.js';
import { type Settings } from '../../types/settings.js';
import { resolveActiveProvider, getLanguageModel } from '../../llm.js';
import { tools } from '../../tools/index.js';

interface ChatCommandProps {
	settings: Settings;
	onBack: () => void;
	onCommand?: (cmd: string) => void;
}

type ChatStatus = 'idle' | 'streaming' | 'thinking';

export default function ChatCommand({ settings, onBack, onCommand }: ChatCommandProps): React.JSX.Element {
	const theme = useTheme();
	const [messages, setMessages] = useState<ChatMessageData[]>([]);
	const [input, setInput] = useState('');
	const [status, setStatus] = useState<ChatStatus>('idle');
	const [streamBuffer, setStreamBuffer] = useState('');

	const provider = resolveActiveProvider(settings);
	const [paletteCursor, setPaletteCursor] = useState(0);

	const paletteOpen = input.startsWith('/');
	const paletteFiltered = PALETTE_ITEMS.filter(
		item => item.cmd.startsWith(input) || input === '/'
	);

	const appendMessage = useCallback((msg: ChatMessageData) => {
		setMessages(prev => [...prev, msg]);
	}, []);

	const sendMessage = useCallback(async (text: string) => {
		if (!provider) return;

		const userMsg: ChatMessageData = {
			id: Date.now().toString(),
			role: 'user',
			content: text,
		};
		setMessages(prev => [...prev, userMsg]);
		setStatus('streaming');
		setStreamBuffer('');

		const history = messages.map(m => ({
			role: m.role === 'user' ? ('user' as const) : ('assistant' as const),
			content: m.content,
		})).filter(m => m.role === 'user' || m.role === 'assistant');

		try {
			const model = getLanguageModel(settings, provider);

			const result = streamText({
				model,
				messages: [
					...history,
					{ role: 'user', content: text },
				],
				tools,
				stopWhen: stepCountIs(5),
				onChunk: ({ chunk }) => {
					if (chunk.type === 'text-delta') {
						setStreamBuffer(prev => prev + chunk.text);
					}
				},
				onStepFinish: (step) => {
					if (step.toolCalls && step.toolCalls.length > 0) {
						setStatus('thinking');
						for (let i = 0; i < step.toolCalls.length; i++) {
							const call = step.toolCalls[i];
							const res = step.toolResults?.[i];
							appendMessage({
								id: `tool-${Date.now()}-${i}`,
								role: 'tool',
								toolName: call.toolName,
								content: res
									? JSON.stringify((res as { output?: unknown }).output ?? (res as { result?: unknown }).result ?? res, null, 0)
									: JSON.stringify((call as { input?: unknown }).input ?? call),
							});
						}
					}
				},
			});

			const fullText = await result.text;
			setStreamBuffer('');
			appendMessage({
				id: `ai-${Date.now()}`,
				role: 'assistant',
				content: fullText,
			});
		} catch (err) {
			setStreamBuffer('');
			appendMessage({
				id: `err-${Date.now()}`,
				role: 'error',
				content: err instanceof Error ? err.message : String(err),
			});
		} finally {
			setStatus('idle');
		}
	}, [messages, provider, settings, appendMessage]);

	const runPaletteItem = useCallback((cmd: string) => {
		setInput('');
		setPaletteCursor(0);
		if (cmd === '/exit' || cmd === '/quit') { onBack(); return; }
		onCommand?.(cmd);
	}, [onBack, onCommand]);

	useInput((char, key) => {
		if (status === 'streaming' || status === 'thinking') return;

		/* ── palette open ── */
		if (paletteOpen) {
			if (key.escape) {
				setInput('');
				setPaletteCursor(0);
				return;
			}
			if (key.upArrow) {
				setPaletteCursor(c => Math.max(0, c - 1));
				return;
			}
			if (key.downArrow) {
				setPaletteCursor(c => Math.min(paletteFiltered.length - 1, c + 1));
				return;
			}
			if (key.return || key.tab) {
				const chosen = paletteFiltered[paletteCursor];
				if (chosen) runPaletteItem(chosen.cmd);
				return;
			}
			if (key.backspace || key.delete) {
				setInput(prev => prev.slice(0, -1));
				setPaletteCursor(0);
				return;
			}
			if (char && char !== '\t') {
				setInput(prev => prev + char);
				setPaletteCursor(0);
			}
			return;
		}

		/* ── normal input ── */
		if (key.escape) { onBack(); return; }

		if (key.backspace || key.delete) {
			setInput(prev => prev.slice(0, -1));
			return;
		}

		if (key.return) {
			const trimmed = input.trim();
			if (trimmed) {
				setInput('');
				sendMessage(trimmed);
			}
			return;
		}

		if (char) setInput(prev => prev + char);
	});

	const spinnerFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
	const spinnerFrame = spinnerFrames[Math.floor(Date.now() / 100) % spinnerFrames.length];

	return (
		<Box flexDirection="column" paddingX={1} paddingTop={1}>

			{/* Header */}
			<Box borderStyle="single" borderColor={theme.border} paddingX={2} marginBottom={1}>
				<Text color={theme.primary} bold>Chat</Text>
				{provider ? (
					<>
						<Text color={theme.muted}>  │  </Text>
						<Text color={theme.secondary}>{provider.name}</Text>
						<Text color={theme.muted}>  ›  </Text>
						<Text color={theme.accent}>{provider.model}</Text>
					</>
				) : (
					<Text color="#ef4444">  No provider configured — run /settings first</Text>
				)}
				<Text color={theme.muted}>  │  </Text>
				<Text color={theme.muted} dimColor>type / for commands · Esc to exit</Text>
			</Box>

			{/* Message history */}
			<Box flexDirection="column" gap={1} marginBottom={1}>
				{messages.length === 0 && (
					<Text color={theme.muted} dimColor>
						{provider
							? `Ask anything… (${provider.name} / ${provider.model})`
							: 'Configure a provider in /settings to start chatting.'}
					</Text>
				)}
				{messages.map(msg => (
					<ChatMessage key={msg.id} message={msg} />
				))}
			</Box>

			{/* Live stream buffer */}
			{streamBuffer.length > 0 && (
				<Box gap={1} marginBottom={1}>
					<Text color={theme.primary} bold>AI</Text>
					<Text color={theme.border}>›</Text>
					<Text color="white">{streamBuffer}</Text>
				</Box>
			)}

			{/* Status */}
			{status === 'thinking' && (
				<Box gap={1} marginBottom={1}>
					<Text color={theme.muted}>{spinnerFrame}</Text>
					<Text color={theme.muted} dimColor>Running tool…</Text>
				</Box>
			)}

			{/* Command palette */}
			{status === 'idle' && paletteOpen && paletteFiltered.length > 0 && (
				<CommandPalette query={input} cursor={paletteCursor} />
			)}

			{/* Input */}
			{status === 'idle' && (
				<Box gap={1}>
					<Text color={theme.primary} bold>{'>'}</Text>
					<Text color={paletteOpen ? theme.secondary : theme.accent}>{input}</Text>
					<Text color={theme.muted}>█</Text>
				</Box>
			)}

			{status === 'streaming' && (
				<Box gap={1}>
					<Text color={theme.muted}>{spinnerFrame}</Text>
					<Text color={theme.muted} dimColor>Streaming…</Text>
				</Box>
			)}

		</Box>
	);
}

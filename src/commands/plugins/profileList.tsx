import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { useTheme } from '../../context/ThemeContext.js';
import { type PluginStore, type ToolProfile } from '../../types/plugins.js';

interface ProfileListProps {
	store: PluginStore;
	onSave: (store: PluginStore) => void;
	onBack: () => void;
}

type ProfileView = 'list' | 'editTools' | 'newName';

export default function ProfileList({ store, onSave, onBack }: ProfileListProps): React.JSX.Element {
	const theme = useTheme();
	const [view, setView]           = useState<ProfileView>('list');
	const [cursor, setCursor]       = useState(0);
	const [toolCursor, setToolCursor] = useState(0);
	const [newName, setNewName]     = useState('');

	const profiles = store.profiles;
	const activeProfile = profiles[cursor] as ToolProfile | undefined;

	useInput((char, key) => {
		if (key.escape) {
			if (view !== 'list') { setView('list'); return; }
			onBack();
			return;
		}

		/* ── new profile name input ── */
		if (view === 'newName') {
			if (key.return && newName.trim()) {
				const profile: ToolProfile = {
					id: `profile_${Date.now()}`,
					name: newName.trim(),
					description: '',
					toolIds: [],
				};
				onSave({ ...store, profiles: [...store.profiles, profile] });
				setCursor(store.profiles.length);
				setNewName('');
				setView('list');
				return;
			}
			if (key.backspace || key.delete) { setNewName(p => p.slice(0, -1)); return; }
			if (char) setNewName(p => p + char);
			return;
		}

		/* ── tool assignment list ── */
		if (view === 'editTools') {
			if (key.upArrow)   { setToolCursor(c => Math.max(0, c - 1)); return; }
			if (key.downArrow) { setToolCursor(c => Math.min(store.tools.length - 1, c + 1)); return; }
			if (char === ' ' || key.return) {
				if (!activeProfile) return;
				const tool = store.tools[toolCursor];
				if (!tool) return;
				const has = activeProfile.toolIds.includes(tool.id);
				const toolIds = has
					? activeProfile.toolIds.filter(id => id !== tool.id)
					: [...activeProfile.toolIds, tool.id];
				const profiles = store.profiles.map(p =>
					p.id === activeProfile.id ? { ...p, toolIds } : p
				);
				onSave({ ...store, profiles });
				return;
			}
			return;
		}

		/* ── profile list ── */
		if (key.upArrow)   { setCursor(c => Math.max(0, c - 1)); return; }
		if (key.downArrow) { setCursor(c => Math.min(profiles.length, c + 1)); return; }

		if (key.return) {
			if (cursor === profiles.length) { setView('newName'); return; }
			setToolCursor(0);
			setView('editTools');
			return;
		}

		if (char === 'a' || char === 'A') {
			if (cursor >= profiles.length || !activeProfile) return;
			onSave({ ...store, activeProfileId: activeProfile.id });
			return;
		}

		if (char === 'd' || char === 'D') {
			if (cursor >= profiles.length || !activeProfile) return;
			if (activeProfile.id === 'default') return;
			const nextProfiles = store.profiles.filter(p => p.id !== activeProfile.id);
			const activeProfileId = store.activeProfileId === activeProfile.id
				? 'default'
				: store.activeProfileId;
			onSave({ ...store, profiles: nextProfiles, activeProfileId });
			setCursor(Math.max(0, cursor - 1));
			return;
		}
	});

	/* ── new profile name ── */
	if (view === 'newName') {
		return (
			<Box flexDirection="column" paddingX={2} paddingY={1}>
				<Text bold color={theme.primary}>New Profile Name</Text>
				<Box gap={1} marginTop={1} borderStyle="round" borderColor={theme.border} paddingX={2} paddingY={0}>
					<Text color={theme.accent}>{newName}</Text>
					<Text color={theme.muted}>█</Text>
				</Box>
				<Box marginTop={1}><Text color={theme.muted} dimColor>Enter to confirm · Esc to cancel</Text></Box>
			</Box>
		);
	}

	/* ── tool assignment ── */
	if (view === 'editTools' && activeProfile) {
		return (
			<Box flexDirection="column" paddingX={2} paddingY={1}>
				<Box marginBottom={1} gap={2}>
					<Text bold color={theme.primary}>Assign Tools → {activeProfile.name}</Text>
					<Text color={theme.muted}>Space/Enter toggle  Esc back</Text>
				</Box>
				<Box flexDirection="column" borderStyle="round" borderColor={theme.border} paddingX={2} paddingY={0}>
					{store.tools.map((t, i) => {
						const active = i === toolCursor;
						const assigned = activeProfile.toolIds.includes(t.id);
						return (
							<Box key={t.id} gap={2}>
								<Text color={active ? theme.secondary : theme.border} bold>{active ? '›' : ' '}</Text>
								<Text color={assigned ? '#4ade80' : theme.muted}>{assigned ? '✓' : '○'}</Text>
								<Text color={active ? theme.accent : theme.primary} bold>{t.name.padEnd(20)}</Text>
								<Text color={t.enabled ? theme.muted : '#ef4444'}>
									{t.enabled ? '' : '[disabled]'}
								</Text>
							</Box>
						);
					})}
				</Box>
			</Box>
		);
	}

	/* ── profile list ── */
	return (
		<Box flexDirection="column" paddingX={2} paddingY={1}>
			<Box marginBottom={1} gap={2}>
				<Text bold color={theme.primary}>👤 Profiles</Text>
				<Text color={theme.muted}>↑↓ navigate  Enter edit tools  A activate  D delete  Esc back</Text>
			</Box>

			<Box flexDirection="column" borderStyle="round" borderColor={theme.border} paddingX={2} paddingY={0}>
				{profiles.map((p, i) => {
					const active = i === cursor;
					const isActive = p.id === store.activeProfileId;
					return (
						<Box key={p.id} gap={2}>
							<Text color={active ? theme.secondary : theme.border} bold>{active ? '›' : ' '}</Text>
							<Text color={isActive ? '#4ade80' : theme.muted}>{isActive ? '★' : '☆'}</Text>
							<Text color={active ? theme.accent : theme.primary} bold>{p.name.padEnd(18)}</Text>
							<Text color={theme.muted}>{p.toolIds.length} tool{p.toolIds.length !== 1 ? 's' : ''}</Text>
							{isActive && <Text color='#4ade80'> ← active</Text>}
						</Box>
					);
				})}
				<Box key="__new__" gap={2} marginTop={1}>
					<Text color={cursor === profiles.length ? theme.secondary : theme.border} bold>
						{cursor === profiles.length ? '›' : ' '}
					</Text>
					<Text color={cursor === profiles.length ? theme.accent : theme.muted}>+ New profile</Text>
				</Box>
			</Box>
		</Box>
	);
}

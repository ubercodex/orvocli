import React, { useState } from 'react';
import { Box, useApp } from 'ink';
import Splash from './Splash.js';
import SettingsCommand from './commands/settings/index.js';
import ChatCommand from './commands/chat/index.js';
import { type Settings, THEMES } from './types/settings.js';
import { ThemeContext } from './context/ThemeContext.js';
import { loadSettings, saveSettings, getWorkspaceName } from './store.js';

type Overlay = null | 'settings';

export default function App(): React.JSX.Element {
	const { exit } = useApp();
	const [overlay, setOverlay] = useState<Overlay>(null);
	const [settings, setSettings] = useState<Settings>(() => loadSettings());
	const workspaceName = getWorkspaceName();

	const handleSaveSettings = (updated: Settings) => {
		setSettings(updated);
		saveSettings(updated);
	};

	const handleChatCommand = (cmd: string) => {
		if (cmd === '/settings') { setOverlay('settings'); return; }
		if (cmd === '/exit' || cmd === '/quit') { exit(); return; }
	};

	const theme = THEMES[settings.theme];
	const activeModel =
		settings.providers.anthropic.selectedModel ||
		settings.providers.openai.selectedModel ||
		settings.providers.google.selectedModel ||
		'';

	if (overlay === 'settings') {
		return (
			<ThemeContext.Provider value={theme}>
				<Box flexDirection="column">
					<SettingsCommand
						settings={settings}
						onSave={handleSaveSettings}
						onBack={() => setOverlay(null)}
					/>
				</Box>
			</ThemeContext.Provider>
		);
	}

	return (
		<ThemeContext.Provider value={theme}>
			<Box flexDirection="column">
				<Splash workspace={{ name: workspaceName, model: activeModel }} />
				<ChatCommand
					settings={settings}
					onBack={exit}
					onCommand={handleChatCommand}
				/>
			</Box>
		</ThemeContext.Provider>
	);
}

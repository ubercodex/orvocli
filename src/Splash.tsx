import React from 'react';
import { Box, Text } from 'ink';
import { createRequire } from 'module';
import { type WorkspaceConfig, DEFAULT_WORKSPACE } from './types/workspace.js';
import { useTheme } from './context/ThemeContext.js';

const require = createRequire(import.meta.url);
const { version } = require('../package.json') as { version: string };

interface SplashProps {
	workspace?: WorkspaceConfig;
	animated?: boolean;
}

export default function Splash({ workspace = DEFAULT_WORKSPACE }: SplashProps): React.JSX.Element {
	const theme = useTheme();

	return <></>;
}

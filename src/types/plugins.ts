export type ToolParamType = 'string' | 'number' | 'boolean';

export interface ToolParam {
	name: string;
	type: ToolParamType;
	description: string;
	required: boolean;
}

export type ToolKind = 'builtin' | 'custom';

export interface PluginTool {
	id: string;
	name: string;
	description: string;
	kind: ToolKind;
	enabled: boolean;
	params: ToolParam[];
	code?: string;
}

export interface ToolProfile {
	id: string;
	name: string;
	description: string;
	toolIds: string[];
	systemPrompt?: string;
}

export interface PluginStore {
	tools: PluginTool[];
	profiles: ToolProfile[];
	activeProfileId: string | null;
}

export const DEFAULT_PLUGIN_STORE: PluginStore = {
	tools: [
		{
			id: 'builtin_getDateTime',
			name: 'getDateTime',
			description: 'Returns current date, time, day and timezone',
			kind: 'builtin',
			enabled: true,
			params: [
				{
					name: 'timezone',
					type: 'string',
					description: 'IANA timezone name e.g. "America/New_York"',
					required: false,
				},
			],
		},
	],
	profiles: [
		{
			id: 'default',
			name: 'Default',
			description: 'All built-in tools enabled',
			toolIds: ['builtin_getDateTime'],
		},
	],
	activeProfileId: 'default',
};

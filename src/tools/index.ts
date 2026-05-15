import { getDateTime } from './getDateTime.js';

export const tools = {
	getDateTime,
};

export type ToolName = keyof typeof tools;

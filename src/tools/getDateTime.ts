import { tool } from 'ai';
import { z } from 'zod';

const inputSchema = z.object({
	timezone: z
		.string()
		.optional()
		.describe('IANA timezone name e.g. "America/New_York". Defaults to system local timezone.'),
});

export const getDateTime = tool({
	description:
		'Returns the current date, time, day of week, and timezone. ' +
		'Use this when the user asks what time it is, what day it is, or anything about the current date/time.',
	inputSchema,
	execute: async ({ timezone }: z.infer<typeof inputSchema>) => {
		const now = new Date();
		const opts: Intl.DateTimeFormatOptions = {
			timeZone: timezone,
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			timeZoneName: 'short',
		};
		const formatted = new Intl.DateTimeFormat('en-US', opts).format(now);
		return {
			iso: now.toISOString(),
			formatted,
			timezone: timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
		};
	},
});

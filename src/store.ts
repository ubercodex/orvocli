import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { type Settings, type ProviderName, DEFAULT_SETTINGS } from './types/settings.js';
import { type PluginStore, DEFAULT_PLUGIN_STORE } from './types/plugins.js';
import { encryptKey, decryptKey } from './crypto.js';

const ORVO_DIR = '.orvo';
const SETTINGS_FILE = 'settings.json';
const PLUGINS_FILE = 'plugins.json';
const PROVIDER_NAMES: ProviderName[] = ['anthropic', 'google', 'openai'];

function getSettingsPath(): string {
	return join(process.cwd(), ORVO_DIR, SETTINGS_FILE);
}

function decryptProviderKeys(settings: Settings): Settings {
	const providers = { ...settings.providers };
	for (const p of PROVIDER_NAMES) {
		providers[p] = {
			...providers[p],
			apiKey: decryptKey(providers[p].apiKey),
		};
	}
	return { ...settings, providers };
}

function encryptProviderKeys(settings: Settings): Settings {
	const providers = { ...settings.providers };
	for (const p of PROVIDER_NAMES) {
		providers[p] = {
			...providers[p],
			apiKey: encryptKey(providers[p].apiKey),
		};
	}
	return { ...settings, providers };
}

export function loadSettings(): Settings {
	const settingsPath = getSettingsPath();
	if (!existsSync(settingsPath)) return { ...DEFAULT_SETTINGS };

	try {
		const raw = readFileSync(settingsPath, 'utf8');
		const parsed = JSON.parse(raw) as Partial<Settings>;
		const merged: Settings = {
			...DEFAULT_SETTINGS,
			...parsed,
			providers: {
				...DEFAULT_SETTINGS.providers,
				...(parsed.providers ?? {}),
			},
		};
		const decrypted = decryptProviderKeys(merged);

		const hasPlaintext = PROVIDER_NAMES.some(
			p => merged.providers[p].apiKey && !merged.providers[p].apiKey.startsWith('enc:')
		);
		if (hasPlaintext) saveSettings(decrypted);

		return decrypted;
	} catch {
		return { ...DEFAULT_SETTINGS };
	}
}

export function saveSettings(settings: Settings): void {
	const dir = join(process.cwd(), ORVO_DIR);
	if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
	const encrypted = encryptProviderKeys(settings);
	writeFileSync(
		join(dir, SETTINGS_FILE),
		JSON.stringify(encrypted, null, 2) + '\n',
		'utf8'
	);
}

export function getWorkspaceName(): string {
	return process.cwd().split(/[\/]/).pop() ?? process.cwd();
}

function getPluginsPath(): string {
	return join(process.cwd(), ORVO_DIR, PLUGINS_FILE);
}

export function loadPluginStore(): PluginStore {
	const pluginsPath = getPluginsPath();
	if (!existsSync(pluginsPath)) return structuredClone(DEFAULT_PLUGIN_STORE);
	try {
		const raw = readFileSync(pluginsPath, 'utf8');
		const parsed = JSON.parse(raw) as Partial<PluginStore>;
		const tools = (parsed.tools ?? DEFAULT_PLUGIN_STORE.tools).map(t =>
			t.id.startsWith('builtin_') ? { ...t, kind: 'builtin' as const } : t
		);
		return {
			...DEFAULT_PLUGIN_STORE,
			...parsed,
			tools,
			profiles: parsed.profiles ?? DEFAULT_PLUGIN_STORE.profiles,
		};
	} catch {
		return structuredClone(DEFAULT_PLUGIN_STORE);
	}
}

export function savePluginStore(store: PluginStore): void {
	const dir = join(process.cwd(), ORVO_DIR);
	if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
	writeFileSync(
		join(dir, PLUGINS_FILE),
		JSON.stringify(store, null, 2) + '\n',
		'utf8'
	);
}

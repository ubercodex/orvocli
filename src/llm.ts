import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { type LanguageModel } from 'ai';
import { type Settings, type ProviderName, PROVIDER_MODELS } from './types/settings.js';

export interface ActiveProvider {
	name: ProviderName;
	model: string;
}

export function resolveActiveProvider(settings: Settings): ActiveProvider | null {
	const order: ProviderName[] = ['anthropic', 'google', 'openai'];
	for (const name of order) {
		const cfg = settings.providers[name];
		if (cfg.apiKey && cfg.selectedModel) {
			return { name, model: cfg.selectedModel };
		}
	}
	return null;
}

export function getLanguageModel(settings: Settings, provider: ActiveProvider): LanguageModel {
	const apiKey = settings.providers[provider.name].apiKey;

	switch (provider.name) {
		case 'anthropic': {
			const client = createAnthropic({ apiKey });
			return client(provider.model);
		}
		case 'google': {
			const client = createGoogleGenerativeAI({ apiKey });
			return client(provider.model);
		}
		case 'openai': {
			const client = createOpenAI({ apiKey });
			return client(provider.model);
		}
	}
}

export function getAvailableModels(settings: Settings): { provider: ProviderName; model: string }[] {
	const result: { provider: ProviderName; model: string }[] = [];
	for (const [p, cfg] of Object.entries(settings.providers) as [ProviderName, typeof settings.providers[ProviderName]][]) {
		if (cfg.apiKey) {
			for (const m of PROVIDER_MODELS[p]) {
				result.push({ provider: p, model: m });
			}
		}
	}
	return result;
}

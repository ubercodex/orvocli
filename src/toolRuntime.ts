import { createRequire } from 'module';

const _require = createRequire(import.meta.url);

export function makeToolFn(argNames: string[], code: string): (...args: unknown[]) => Promise<unknown> {
	const fn = new Function(
		'require',
		...argNames,
		`"use strict";\nreturn (async () => {\n${code}\n})();`
	);
	return (...args: unknown[]) => fn(_require, ...args) as Promise<unknown>;
}

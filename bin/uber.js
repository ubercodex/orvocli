#!/usr/bin/env node
import { spawnSync } from 'child_process';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, resolve } from 'path';
import { createRequire } from 'module';

const __dirname = dirname(fileURLToPath(import.meta.url));
const entry = resolve(__dirname, '../src/cli.tsx');

const require = createRequire(import.meta.url);
const tsxHook = pathToFileURL(require.resolve('tsx')).href;

const result = spawnSync(
	process.execPath,
	['--import', tsxHook, entry, ...process.argv.slice(2)],
	{
		stdio: 'inherit',
		env: {
			...process.env,
			TSX_TSCONFIG_PATH: resolve(__dirname, '../tsconfig.json'),
		},
	}
);

process.exit(result.status ?? 1);

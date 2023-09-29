import { getConfig } from '@shgysk8zer0/js-utils/rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default getConfig('./index.js', {
	format: 'cjs',
	minify: false,
	sourcemap: false,
	external: ['node:crypto', 'node:path', 'node:fs'],
	plugins: [nodeResolve()],
	globals: {},
});

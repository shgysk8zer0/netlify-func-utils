import { getConfig } from '@shgysk8zer0/js-utils/rollup';

export default getConfig('./slack/slack.js', {
	format: 'cjs',
	minify: false,
	sourcemap: false,
	external: ['node:child_process'],
	plugins: [],
	globals: {},
});

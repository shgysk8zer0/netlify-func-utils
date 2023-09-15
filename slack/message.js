/**
 * @see https://api.slack.com/reference/block-kit/blocks
 * @see https://app.slack.com/block-kit-builder/
 */
import { SlackBlock } from './block/block.js';
import { SlackError } from './error.js';
import { isURL } from '../validation.js';

const HOOK_ORIGINS = ['https://hooks.slack.com/'];

export class SlackMessage {
	#webhook;
	#blocks = [];

	constructor(webhook = globalThis?.process?.env?.SLACK_WEBHOOK) {
		if (! (isURL(webhook) && HOOK_ORIGINS.some(origin => webhook.startsWith(origin)))) {
			throw new Error('Invalid Slack Web Hook URL.');
		} else {
			this.#webhook = webhook;
		}
	}

	toJSON() {
		return { blocks: this.#blocks };
	}

	add(...blocks) {
		const count = this.#blocks.push(...blocks.filter(block => block instanceof SlackBlock));

		if (count !== blocks.length) {
			throw new Error('Error adding block to message.');
		}

		return this;
	}

	clear() {
		this.#blocks = [];
	}

	async debug() {
		const url = new URL('https://app.slack.com/block-kit-builder');
		url.hash = JSON.stringify(this);

		if (typeof window !== 'undefined') {
			window.open(url);
		} else if (typeof process !== 'undefined') {
			const { exec } = await import('node:child_process');

			await new Promise((resolve, reject) => {
				switch (process.platform) {
					case 'linux':
					case 'freebsd':
					case 'openbsd':
					case 'netbsd':
						exec(`xdg-open "${url}"`, err => err instanceof Error ? reject(err) : resolve());
						break;

					case 'darwin':
						exec(`open "${url}"`, err => err instanceof Error ? reject(err) : resolve());
						break;

					case 'win32':
						exec(`start "" "${url}"`, err => err instanceof Error ? reject(err) : resolve());
						break;

					default:
						throw new Error(`Unknown platform: ${process.platform}.`);
				}
			});
		}
	}

	async send({ signal } = {}) {
		const resp = await fetch(this.#webhook, {
			method: 'POST',
			moode: 'cors',
			referrerPolicy: 'no-referrer',
			headers: new Headers({
				Accept: 'text/plain',
				'Content-Type': 'application/json',
			}),
			body: JSON.stringify(this),
			signal,
		});

		if (! resp.ok) {
			const code = await resp.text();
			const { status, statusText } = resp;
			throw new  SlackError('Error sending message', { code, status, statusText });
		}
	}
}

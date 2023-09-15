import { SlackMessage } from './slack/message.js';
import { SlackHeaderBlock } from './slack/block/header.js';
import { SlackPlainTextElement } from './slack/element/plain-text.js';
import { SlackMarkdownElement } from './slack/element/markdown.js';
import { SlackImageBlock } from './slack/block/image.js';
import { SlackDividerBlock } from './slack/block/divider.js';
import { SlackButtonElement } from './slack/element/button.js';
import { SlackSectionBlock } from './slack/block/section.js';

const msg = new SlackMessage();

msg.add(
	new SlackHeaderBlock(new SlackPlainTextElement('New Message on from Slack Bot')),
	new SlackDividerBlock(),
	new SlackImageBlock('https://cdn.kernvalley.us/img/raster/missing-image.png', {
		title: new SlackPlainTextElement('Here is some image'),
		alt: 'Missing Image',
	}),
	new SlackSectionBlock(
		new SlackMarkdownElement('*Sally* has requested you set the deadline for the Nano launch project'),
		{
			accessory: new SlackButtonElement('Open link!', {
				style: 'primary',
				url: 'https://example.com',
			}),
			fields: [
				new SlackPlainTextElement('Click Something!'),
				new SlackMarkdownElement('*Email:* <mailto:user@example.com | user@example.com>'),
			]
		},
	),
).send().then(
	() => console.log('Message sent'),
	async err => {
		console.error(err);
		await msg.debug().catch(console.log);
	}
);

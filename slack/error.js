export class SlackError extends Error {
	constructor(message, { status, statusText, code }) {
		super(message);
		this.status = status;
		this.statusText = statusText;
		this.code = code;
	}
}

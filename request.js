import { JSON as JSON_MIME, JSON_LD, WEB_APP_MANIFEST, FORM_URL_ENCODED, FORM_MULTIPART } from '@shgysk8zer0/consts/mimes.js';

export class NetlifyRequest extends Request {
	#cookies;

	/**
	 * Constructor to create a new NetlifyRequest instance.
	 *
	 * @param {HandlerEvent} event - The Netlify function event object destructured into properties.
	 * @param {string} event.httpMethod - The HTTP request method.
	 * @param {string|undefined} event.body - The request body, if present.
	 * @param {string} [event.path='/'] - The request path (default is '/').
	 * @param {string|undefined} event.rawQuery - The raw query string, if present.
	 * @param {boolean} [event.isBase64Encoded=false] - Indicates if the body is base64-encoded (default is false).
	 * @param {object} event.headers - An object containing request headers.
	 * @param {string|undefined} event.headers.referer - The referer header.
	 * @param {string|undefined} event.headers.cookie - The cookie header.
	 * @param {object} event.headers - Additional request headers.
	 */
	constructor({
		httpMethod,
		body,
		path = '/',
		rawQuery,
		isBase64Encoded = false,
		headers: { referer, ...headers } = {},
	}) {
		const url = new URL(`${path || '/'}`,
			process.env.BASE_URL ?? headers.hasOwnProperty('host')
				? `http://${headers.host}`
				: 'http://localhost:9999'
		);

		if (typeof rawQuery === 'string' && rawQuery.length !== 0) {
			url.search = rawQuery;
		}

		super(url, {
			method: httpMethod,
			mode: headers['sec-fetch-mode'],
			headers: new Headers({ ...headers, referer }),
			referrer: referer, // Deal with typo in HTTP spec
			body: (
				typeof body === 'string'
				&& ! ['GET', 'DELETE', 'HEAD', 'OPTIONS'].includes(httpMethod)
			)
				? isBase64Encoded ? atob(body) : body
				: undefined,
		});

		// Parse and store cookies in a private Map
		if (this.headers.has('Cookie')) {
			this.#cookies = new Map(this.headers.get('Cookie').split(';').map(c => c.split('=').map(s => decodeURIComponent(s.trim()))));
			this.headers.delete('Cookie');
		} else {
			this.#cookies = new Map();
		}
	}

	get contentType() {
		if (this.headers.has('Content-Type')) {
			return this.headers.get('Content-Type').split(';')[0].trim().toLowerCase();
		} else {
			return '';
		}
	}

	get isJSON() {
		return [JSON_MIME, JSON_LD, WEB_APP_MANIFEST, 'text/json'].includes(this.contentType);
	}

	get  isFormData() {
		return [FORM_MULTIPART, FORM_URL_ENCODED].includes(this.contentType);
	}

	get geo() {
		if (this.headers.has('X-NF-Geo')) {
			return JSON.parse(atob(this.headers.get('X-NF-Geo')));
		} else {
			return {};
		}
	}

	get cookies() {
		return this.#cookies;
	}

	get searchParams() {
		return new URL(this.url).searchParams;
	}
}

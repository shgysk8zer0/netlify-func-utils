import { INTERNAL_SERVER_ERROR, NOT_IMPLEMENTED, NO_CONTENT } from '@shgysk8zer0/http/status';
import { HTTPError } from '@shgysk8zer0/http/error';
import { NetlifyRequest } from './request.js';

export function createOptionsHandler(handlers, { cors = true }) {
	const methods = [...Object.keys(handlers), 'OPTIONS'];

	return async () => {
		const resp = new Response(null, {
			status: NO_CONTENT,
			headers:  new Headers({ 'Options': methods.join(', ').toUpperCase() }),
		});

		if (cors) {
			resp.headers.set('Access-Control-Allow-Methods', methods.join(', ').toUpperCase());
		}

		return resp;
	};
}

/**
 * Convert a Response object into the format required by Netlify Functions and send the response.
 *
 * @param {Response} resp - The Response object to convert and send.
 * @returns {Promise<{ statusCode: number, headers: [string, string][], body: string }>} - A promise that resolves to the Netlify-compatible response format.
 */
export const send = async (resp, { headers, cors = true, allowHeaders = [] } = {}) => {
	if (! (resp instanceof Response)) {
		return send(Response.json(
			new HTTPError('Invalid response object.', { status: INTERNAL_SERVER_ERROR }),
			{ status: INTERNAL_SERVER_ERROR, }
		), { headers, cors, allowHeaders });
	} else if (resp.status === 0) {
		return send(
			Response.json(new HTTPError('An unknown error occurred.', { status: INTERNAL_SERVER_ERROR, headers: resp.headers })),
			{ headers, cors, allowHeaders, resp }
		);
	} else if (headers instanceof Headers) {
		for (const [key, value] of headers.entries()) {
			resp.headers.append(key, value);
		}

		return send(resp, { cors, allowHeaders });
	} else if (typeof headers === 'object' && headers !== null) {
		return send(resp, { headers: new Headers(headers), cors, allowHeaders });
	} else {
		if (cors && ! resp.headers.has('Access-Control-Allow-Origin')) {
			resp.headers.set('Access-Control-Allow-Origin', '*');

			if (Array.isArray(allowHeaders) && allowHeaders.length !== 0 && ! resp.headers.has('Access-Control-Allow-Headers')) {
				resp.headers.set('Access-Control-Allow-Headers', allowHeaders.join(', '));
			}
		}

		return {
			statusCode: resp.status === 0 ? INTERNAL_SERVER_ERROR : resp.status,
			headers: Object.fromEntries(resp.headers),
			body: await resp.text(),
		};
	}

};

export function createHandler(methodHandlers = {}, {
	headers = new Headers(),
	allowHeaders = [],
	cors = true,
	logger = console.log,
} = {}) {
	if (! methodHandlers.hasOwnProperty('options')) {
		methodHandlers.options = createOptionsHandler(methodHandlers, { allowHeaders, cors });
	}

	return async function handler(event) {
		try {
			const req = new NetlifyRequest(event);

			if (methodHandlers[req.method.toLowerCase()] instanceof Function) {
				const resp = await methodHandlers[req.method.toLowerCase()](req);

				if (! (resp instanceof Response)) {
					throw new TypeError('Response must be a Response object.');
				} else {
					return send(resp, { headers, cors, allowHeaders });
				}
			} else {
				throw new HTTPError('Not implemented.', { status: NOT_IMPLEMENTED });
			}
		} catch(err) {
			if (logger instanceof Function) {
				logger(err);
			}

			if (err instanceof HTTPError) {
				return send(Response.json(err, { status: err.status, headers }), { cors, allowHeaders });
			} else {
				const resp = Response.json({
					error: 'An unknown error occurred.',
					status: INTERNAL_SERVER_ERROR,
				}, { status: INTERNAL_SERVER_ERROR, headers });

				return send(resp, { cors, allowHeaders });
			}
		}
	};
}

export class RequestCookies extends Map {
	toJSON() {
		return Object.fromEntries(this.entries());
	}

	[Symbol.toStringTag]() {
		return 'RequestCookies';
	}

	toString() {
		return Array.from(this, ([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`).join('; ');
	}

	static fromRequest(req) {
		if (req.headers.has('Cookie')) {
			return new RequestCookies(req.headers.get('Cookie').split(';').map(c => c.split('=').map(s => decodeURIComponent(s.trim()))));
		} else {
			return new RequestCookies();
		}
	}
}

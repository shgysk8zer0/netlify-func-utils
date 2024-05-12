if (!(URL.canParse instanceof Function)) {
	URL.canParse = function (url, base) {
		return URL.parse(url, base) instanceof URL;
	};
}

if (!(URL.parse instanceof Function)) {
	URL.parse = function parse(url, base) {
		try {
			return new URL(url, base);
		} catch {
			{
				return null;
			}
		}
	};
}

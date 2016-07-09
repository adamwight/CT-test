define([], function() {

	/**
	 * Shared configuration.
	 *
	 * @exports config
	 */
	var config = {
		/**
		 * @property {string} apiPath Path to `api.php` on the target wiki.
		 * @default
		 */
		apiPath: "/w/api.php",

		/**
		 * @property {string} baseURL Target wiki's base URL.
		 * @default
		 */
		baseURL: "https://en.wikipedia.org",

		/**
		 * @property {string} readabilityMeasure Select which readability measure
		 * we'll use.  Constant must match the string in `readability.js`.
		 * @default
		 */
		readabilityMeasure: "flesch-kincaid"
	};
	return config;
});

// Shared configuration.

define([], function() {
	return {
		apiPath: "/w/api.php",
		// FIXME: catch bad URL exception
		baseURL: "https://en.wikipedia.org",
		readabilityMeasure: "flesch-kincaid"
	};
});

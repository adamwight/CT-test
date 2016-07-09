// Snip article extracts via an API.
//
// Note that we're usually fetching the intro, not the first paragraph of the article itself.

define([
	"config",
	"lib/MediawikiJS.js",
	"lib/jquery.js",
], function (config) {

	var mwjs = MediaWikiJS(
		{baseURL: config.baseURL, apiPath: config.apiPath});

	var Extractor = {
		fetchArticleExtracts: function (articles, doneCallback, _continueObj, _bufferedArticles, _depth) {
			_continueObj = _continueObj || {};
			_bufferedArticles = _bufferedArticles || [];
			_depth = 0;

			// (Seems buggy that exlimit defaults to 1?)
			var pageids = $.map(articles, function (article) { return article.pageid; }),
				params = {
					action: 'query', prop: 'extracts', explaintext: true, exlimit: "max",
					exintro: true, pageids: pageids.join("|")
				};
			$.extend(params, _continueObj);

			console.debug("Making API request:", params);
			mwjs.send(params, function (data) {

				console.debug("Raw response from extractor:", data);

				if (data.error) {
					doneCallback("Couldn't extract from articles: " + data.error.info);
					return;
				}

				// Zip extracts into article objects.
				var extractsByPage = data.query.pages,
					extractedArticles = $.each(extractsByPage, function(pageid, article) {
						if (article.extract) {
							_bufferedArticles.push(article);
						}
					});

				if (data.continue && ++_depth < 3) {
					// Recurse a few times and accumulate the continuation.
					Extractor.fetchArticleExtracts(articles, doneCallback, data.continue, _bufferedArticles, _depth);
				} else {
					// Respond to our caller with the full results.
					doneCallback(null, _bufferedArticles);
				}
			});
		}
	};
	return Extractor;
});

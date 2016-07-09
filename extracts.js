define([
	"config",
	"lib/MediawikiJS.js",
	"lib/jquery.js",
], function (config) {

	var extractor = {
		fetchArticleExtracts: function (articles, doneCallback, _continueObj, _bufferedArticles, _depth) {
			var _continueObj = _continueObj || {},
				_bufferedArticles = _bufferedArticles || [],
				_depth = 0;

			// Note that we'll usually be fetching the intro, not the first paragraph of the article itself.
			//
			// TODO: Haven't figured out how to make excontinue
			// handling do its job!  We receive the same, first 20 entries
			// each request.
			// var params = {action: 'query', prop: 'extracts', explaintext: true, exlimit: "max", exintro: true, pageids: ids.join("|")};
			//
			// So, we emulate continuation here:
			// TODO.
			//
			// (Seems buggy that exlimit defaults to 1?)

			var pageids = $.map(articles, function (article) { return article.pageid; }),
				params = {
					action: 'query', prop: 'extracts', explaintext: true, exlimit: "max",
					exintro: true, pageids: pageids.join("|")
				};
			$.extend(params, _continueObj);

			console.debug("Making API request:", params);

			var mwjs = MediaWikiJS(
				{baseURL: config.baseURL, apiPath: config.apiPath});

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
					extractor.fetchArticleExtracts(articles, doneCallback, data.continue, _bufferedArticles, _depth);
				} else {
					// Respond to our caller with the full results.
					doneCallback(null, _bufferedArticles);
				}
			});
		}
	};
	return extractor;
});

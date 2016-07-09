define([
	"config",
	"lib/MediawikiJS.js",
	"lib/jquery.js"
], function (config) {

	var mwjs = MediaWikiJS(
		{baseURL: config.baseURL, apiPath: config.apiPath});

	/**
	 * Snip article extracts via an API.
	 *
	 * Note that we're usually fetching the intro, not the first paragraph of the article itself.
	 *
	 * @exports Extractor
	 */
	var Extractor = {
		/**
		 * Retrieve an initial chunk of each article
		 *
		 * @param {Object[]} articles Article objects to be requested from the extraction API.
		 * @param {fetchArticleExtractsCallback} doneCallback Called with results or an error.
		 * @param {Object} [_continueObj={}] Internal: used to recurse through continuation responses.
		 * @param {Object[]} [_bufferedArticles=[]] Internal: accumulate results.
		 * @param {integer} [_depth=0] Internal: Track recursion depth.
		 */
		fetchArticleExtracts: function (articles, doneCallback, _continueObj, _bufferedArticles, _depth) {
			_continueObj = _continueObj || {};
			_bufferedArticles = _bufferedArticles || [];
			_depth = 0;

			// (Seems buggy that exlimit defaults to 1?)
			var pageids = $.map(articles, function (article) { return article.pageid; }),
				params = {
					action: "query", prop: "extracts", explaintext: true, exlimit: "max",
					exsectionformat: "plain", exintro: false, pageids: pageids.join("|")
				};
			$.extend(params, _continueObj);

			console.debug("Making API request:", params);
			mwjs.send(params, function (data) {

				console.debug("Raw response from extractor:", data);

				if (data.error) {
					doneCallback("Couldn't extract from articles: " + data.error.info);
					return;
				}

				// Accumulate articles.
				var extractsByPage = data.query.pages,
					extractedArticles = $.each(extractsByPage, function(pageid, article) {
						if (article.extract) {
							// Grab only the first paragraph.
							article.extract = article.extract.replace(/^(.+?)\n[^]*$/m, "$1");

							// Add to our results list.
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

/**
 * Handle article list plus extracts
 *
 * @callback fetchArticleExtractsCallback
 * @param {string} error Error message.  True-ish if any of our API calls failed.
 * @param {Object[]} article objects, with the `.extract` property set.
 */

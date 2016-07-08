define([
	"config",
	"lib/MediawikiJS.js",
	"lib/jquery.js",
], function (config) { return {
	fetchArticleExtracts: function (articles, doneCallback, _continueObj) {

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
			var extractsByPage = data.query.pages;
			/*
			 * This would be worthwhile if we wanted any of the information in
			 * `articles`, but so far it will be redundant with data in the
			 * extract results.
			 *
			 * $.each(articles, function (article) {
			 * 	var extractObj = extractsByPage[article.pageid];
			 * 	if (extractObj) {
			 * 		article.extract = extractObj.extract;
			 * 	}
			 * });
			*/

			// But instead, we toss the input object and pass extract results:
			articles = $.map(extractsByPage, function(article) { return article; });

			doneCallback(null, articles);

			// FIXME: continuation is broken.
			/*
			 * if (data.continue) {
			 * 	// TODO: accumulate
			 * 	fetchExtracts(pageids, data.continue);
			 * }
			 */
		});
	}
}; });

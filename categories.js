// Handle Wikipedia categories

define([
	"config",
	"lib/MediawikiJS.js",
	"lib/jquery.js",
], function (config) {

	// TODO: reuse config->mwjs glue, move somewhere
	var mwjs = MediaWikiJS(
		{baseURL: config.baseURL, apiPath: config.apiPath});

	return {
		fetchCategoryMembers: function (category, doneCallback) {

			// TODO: fast path for empty categories
			var _continueObj = _continueObj || {continue: ""},
				// FIXME: escape category for API?
				category = "Category:" + category,
				params = {
					action: 'query', list: 'categorymembers', cmtitle: category, cmlimit: 50
				};
			
			mwjs.send(params, function (data) {

				console.debug("Raw response to category listing:", data);

				if (data.error) {
					doneCallback("Couldn't get articles in category: " + data.error.info);
					return;
				}

				// TODO:
				// * error handling
				// * logging
				var articles = data.query.categorymembers,
					articles = $.grep(articles, function (article) {
						// Only allow real articles, skip subcategories.
						return !(/^Category:/.exec(article.title));
					});
				doneCallback(null, articles);
			});
		},

		fetchCompletions: function(request, response) {
			var params = {
				'action': "opensearch",
				'format': "json",
				'search': "Category:" + request.term,
			};

			mwjs.send(params, function (data) {
				var unNamespacedCategoryTitles = $.map(data[1], function(title) {
					return title.replace(/^Category:/, "");
				});
				response(unNamespacedCategoryTitles);
			});
		},
	};
});

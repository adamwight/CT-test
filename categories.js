/**
 * Handle Wikipedia categories
 *
 * @module Categories
 *
 * @callback Categories~cb
 * @param {string} error
 * @param {Array} article objects
 */

define([
	"config",
	"lib/MediawikiJS.js",
	"lib/jquery.js"
], function (config) {

	// TODO: reuse config->mwjs glue, move somewhere
	var mwjs = MediaWikiJS(
		{baseURL: config.baseURL, apiPath: config.apiPath});

	return {
		/**
		 * @param {string} category Title of category.
		 * @param {Categories~cb} doneCallback Handle results.
		 */
		fetchCategoryMembers: function (category, doneCallback) {

			var _continueObj = _continueObj || {continue: ""},
				// FIXME: escape category for API?
				fullTitle = "Category:" + category,
				params = {
					action: 'query', list: 'categorymembers', cmtitle: fullTitle, cmlimit: 50
				};
			
			mwjs.send(params, function (data) {

				console.debug("Raw response to category listing:", data);

				if (data.error) {
					doneCallback("Couldn't get articles in category: " + data.error.info);
					return;
				}

				// Skip subcategories.
				var articles = data.query.categorymembers,
					filteredArticles = $.grep(articles, function (article) {
						// Only allow real articles, skip subcategories.
						return !(/^Category:/.exec(article.title));
					});

				doneCallback(null, filteredArticles);
			});
		},

		fetchCompletions: function(request, response) {
			var params = {
				'action': "opensearch",
				'format': "json",
				'search': "Category:" + request.term
			};

			mwjs.send(params, function (data) {
				var unNamespacedCategoryTitles = $.map(data[1], function(title) {
					return title.replace(/^Category:/, "");
				});
				response(unNamespacedCategoryTitles);
			});
		}
	};
});

/**
 * This callback...
 * @callback fetchCategoryMembers~cb
 * @param {string} error
 * @param {Array} article objects
 */

define([
	"config",
	"lib/MediawikiJS.js",
	"lib/jquery.js"
], function (config) {

	// TODO: reuse config->mwjs glue, move somewhere
	var mwjs = MediaWikiJS(
		{baseURL: config.baseURL, apiPath: config.apiPath});

	/**
	 * Retrieve categories from Wikipedia
	 *
	 * @exports Categories
	 */
	var Categories = {
		/**
		 * Get all articles in a category.
		 *
		 * @param {string} category Title of category.
		 * @param {fetchCategoryMembersCallback} doneCallback Handle results.
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

		/**
		 * Search for categories which complete the current term.  Suitable for
		 * use as a jquery ui autocomplete "source" callback.
		 */
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
	return Categories;
});

/**
 * Do something with article list.
 *
 * @callback fetchCategoryMembersCallback
 * @param {string} error Error message.  True-ish if any of our API calls failed.
 * @param {Object[]} article objects
 */

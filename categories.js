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
				fullTitle = "Category:" + category,
				params = {
					action: 'query', list: 'categorymembers', cmtitle: fullTitle, cmlimit: 50
				};
			
			mwjs.send(params, function (data) {

				console.debug("Response to category listing:", data);

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
				if (data.error) {
					// TODO: We should inform the user as well, with a generic exception
					console.error("Couldn't fetch completions: " + data.error.info);
					return;
				}
				var categoryTitles = data[1],
					// Strip namespace from title for display in the menu.
					unNamespacedTitles = $.map(categoryTitles, function(title) {
						return title.replace(/^Category:/, "");
					});

				response(unNamespacedTitles);
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

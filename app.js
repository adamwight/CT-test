requirejs.config({
	"paths": [".", "lib"]
});

define([
	"config",
	"categories",
	"extracts",
	"readability",
	"renderer",
	"lib/jquery.js",
	"lib/jquery-ui/jquery-ui",
	"lib/domReady!"
], function (config, Categories, Extracts, Readability, Renderer) {

	/**
	 * Application startup and UI controllers.
	 *
	 * @exports Main
	 */
	var Main = {
		/**
		 * Rebuild and display article listing based on the current category title.
		 *
		 * @protected
		 */
		refreshCategory: function () {
			var category = $("#category").val();

			Categories.fetchCategoryMembers(category, function(error, articles) {

				// Clear display and start spinner.
				$("#error").empty();
				$("#spinner").toggle(true);

				// Check for errors.
				if (error) {
					Main.displayError(error);
					return;
				}
				if (articles.length === 0) {
					Main.displayError("No articles in category.");
					return;
				}

				// Take the list of articles and get extracts of the introductory text.
				Extracts.fetchArticleExtracts(articles, function(error, articles) {
					if (error) {
						Main.displayError("Couldn't fetch extracts: " + error);
						return;
					}

					// Estimate readability and sort with *least* readable first.
					$.map(articles, function (article) {
						article.readability = Readability.score(article.extract);
					});
					articles = articles.sort(function (a, b) {
						return a.readability - b.readability;
					});

					// Paint results onto the page.
					Main.displayArticles(articles);
				});
			});
		},

		/**
		 * Draw rendered list of articles onto the page.
		 *
		 * @param {Object[]} articles
		 * @protected
		 */
		displayArticles: function (articles) {
			var formatted = Renderer.formatArticleLines(articles);

			$("#article_list").html(formatted);
			$("#spinner").toggle(false);
			$("#error").empty();
		},

		/**
		 * Display an error and clear previous results.
		 *
		 * @param {string} error
		 * @protected
		 */
		displayError: function (error) {
			$("#article_list").empty();
			$("#spinner").toggle(false);
			$("#error").text(error);
		},

		/**
		 * Set up UI behaviors.
		 * @protected
		 */
		attachUiHandlers: function () {
			// Articles link to Wikipedia.
			$("#article_list").on("click", ".article", function () {
				var title = $(this).find(".title").text();
				// TODO: Use more robust title->URL helper.
				window.location = config.baseURL + "/wiki/" + title;
			});

			// Give category input some behaviors.
			$("#category").autocomplete({
				// Autocomplete the category titles.
				source: Categories.fetchCompletions,
				select: Main.refreshCategory
			}).keyup(function (e) {
				// Unfortunate workaround, do special stuff for the <enter> key-up.
				if (e.which === 13) {
					$("#category").blur().focus();
					Main.refreshCategory();
				}
			}).change(Main.refreshCategory);

			// Backdoor for debugging: pass parameter "?debug=1".
			if (/debug/.exec(window.location.href)) {
				$("#category").val("Pythagoreans");
				Main.refreshCategory();
			}
		}
	};

	// Initialize
	Main.attachUiHandlers();
});

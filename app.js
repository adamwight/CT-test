requirejs.config({
	"paths": [".", "lib"]
});

/**
 * Application startup and UI controllers.
 *
 * @module Main
 */
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
	 * Rebuild and display article listing based on the current category title.
	 */
	function refreshCategory() {
		var category = $("#category").val();

		Categories.fetchCategoryMembers(category, function(error, articles) {

			// Clear display and start spinner.
			$("#article_list").html("<img src=\"lib/loading.io-spinner.svg\" alt=\"working...\" />");
			$("#error").text("");

			// Check for errors.
			if (error) {
				$("#article_list").text("");
				$("#error").text(error);
				return;
			}
			if (articles.length === 0) {
				$("#article_list").text("");
				$("#error").text("No articles in category.");
				return;
			}

			Extracts.fetchArticleExtracts(articles, function(error, articles) {
				if (error) {
					$("#article_list").text("");
					$("#error").text("Couldn't fetch extracts: " + error);
					return;
				}

				// Estimate readability and sort with *least* readable first.
				$.map(articles, function (article) {
					article.readability = Readability.score(article.extract);
				});
				articles = articles.sort(function (a, b) {
					return a.readability - b.readability;
				});

				displayArticles(articles);
			});
		});
	}

	function displayArticles(articles) {
		var formatted = Renderer.formatArticleLines(articles);

		$("#article_list").html(formatted);
		$("#error").text("");
	}

	function attachUiHandlers() {
		// Articles link to Wikipedia.
		$("#article_list").on("click", ".article", function () {
			var title = $(this).find(".title").text();
			console.log(title);
			// TODO: Use more robust title->URL helper.
			window.location = config.baseURL + "/wiki/" + title;
		});

		// Give category input some behaviors.
		$("#category").autocomplete({
			// Autocomplete the category titles.
			source: Categories.fetchCompletions,
			select: refreshCategory
		}).keyup(function (e) {
			// Unfortunate workaround, do special stuff for the <enter> key-up.
			if (e.which === 13) {
				$(".ui-menu-item").hide();
				refreshCategory();
			}
		}).change(refreshCategory);

		// Backdoor for debugging: pass parameter "?debug=1".
		if (/debug/.exec(window.location.href)) {
			$("#category").val("Pythagoreans");
			refreshCategory();
		}
	}

	// Initialize
	attachUiHandlers();
});

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
	"lib/jquery-ui/jquery-ui"
], function (config, Categories, Extracts, Readability, Renderer) {

	/** FOO */
	function refreshCategory() {
		var category = $("#category").val();

		Categories.fetchCategoryMembers(category, function(error, articles) {

			// Clear display and start spinner.
			$("#article_list").html("<img src=\"lib/loading.io-spnner.svg\" alt=\"working...\" />");
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

				// Estimate readability and sort with most readable first.
				$.map(articles, function (article) {
					if (article.extract) {
						article.readability = Readability.score(article.extract);
					} else {
						// Naughty magic number to cause unanalyzed articles to
						// sink to the bottom of the list.
						article.readability = 0;
					}
				});
				articles = articles.sort(function (a, b) {
					return b.readability - a.readability;
				});

				displayArticles(articles);
			});
		});
	}

	function displayArticles(articles) {
		var formatted = Renderer.formatArticleLines(articles);

		$("#article_list").html(formatted);
		$("#error").text("");

		// FIXME: seems silly to have to reattach every time?
		applyUiFlair();
	}

	function applyUiFlair() {
		// Articles link to Wikipedia.
		$(".article").click(function () {
			var title = $(this).find(".title").text();
			console.log(title);
			// TODO: Use more robust title->URL helper.
			window.location = config.baseURL + "/wiki/" + title;
			return false;
		});
	}

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
});

requirejs.config({
	"paths": [".", "lib"],
});

define([
	"config",
	"categories",
	"extracts",
	"readability",
	"renderer",
	"lib/jquery.js",
	"lib/jquery-ui/jquery-ui",
], function (config, Categories, Extracts, Readability, Renderer) {

	// Give category input some behaviors.
	$("#category").autocomplete({
		source: Categories.fetchCompletions,

		select: function () {
			var category = $(this).val();
			refreshCategory(category);
		},
	}).keyup(function (e) {
		// Unfortunate workaround for autocomplete thing
		if (e.which === 13) {
			$(".ui-menu-item").hide();
		}
	}).change(function () {
		// TODO: reuse from above.
		var category = $(this).val();
		refreshCategory(category);
	});

	// Backdoor for debugging: pass parameter "?debug=1".
	if (/debug/.exec(window.location.href)) {
		refreshCategory("Pythagoreans");
	}

	function refreshCategory(category) {

		Categories.fetchCategoryMembers(category, function(error, articles) {

			// Clear display and check for errors.
			$("#article_list").html("");
			if (error) {
				$("#error").text(error);
				return;
			}
			if (articles.length === 0) {
				$("#error").text("No articles in category.");
				return;
			}

			Extracts.fetchArticleExtracts(articles, function(error, articles) {

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
		// UI flair
		$(".article").click(function () {
			var title = $(this).find(".title").text();
			console.log(title);
			// TODO: Use more robust title->URL helper.
			window.location = config.baseURL + "/wiki/" + title;
			return false;
		});
	}
});

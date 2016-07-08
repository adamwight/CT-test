define([
	// FIXME: text loader plugin not working...
	//"text!article.html.mustache",
	"lib/mustache.js",
	"lib/jquery.js",
], function (Mustache) {

	// See fixme above.
	var articleTemplate = "<div>" +
		"<div class=\"title\">{{ title }}</div>" +
		"<div class=\"score\">({{ readability }})</div>" +
		"<div class=\"extract\">{{ extract }}</div>" +
		"</div>";

	return {

		formatArticleLines: function (articles) {
			return $.map(articles, this.formatArticleLine);
		},

		formatArticleLine: function (article) {
			var params = article;
			return Mustache.render(articleTemplate, params);
		},
	};
});

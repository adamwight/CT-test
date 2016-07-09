// Format articles into HTML.

define([
	// FIXME: text loader plugin not working...
	//"text!article.html.mustache",
	"lib/mustache.js",
	"lib/jquery.js"
], function (Mustache) {

	// See fixme above.
	var articleTemplate = "<div class=\"article\">" +
		"<div class=\"title\">{{ title }}</div>" +
		"<div class=\"score\">({{ readability }})</div>" +
		"<div class=\"extract\">{{ extract }}{{^ extract }}" +
			"<span class=\"missing\">** No article extract found **</span>{{/ extract }}" +
		"</div>" +
	"</div>";

	return {

		formatArticleLines: function (articles) {
			return $.map(articles, this.formatArticleLine);
		},

		formatArticleLine: function (article) {
			var params = article;
			return Mustache.render(articleTemplate, params);
		}
	};
});

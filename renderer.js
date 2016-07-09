define([
	// Sadly: text loader plugin doesn't work offline...
	// "lib/text!article.html.mustache",
	"lib/mustache.js",
	"lib/jquery.js"
], function (Mustache) {

	/**
	 * Format articles into HTML.
	 *
	 * @exports Renderer
	 */
	var Renderer = {

		/**
		 * @property {string} articleTemplate Mustache template for rendering a
		 * single article record.
		 *
		 * FIXME: should pull from the requirejs text loader plugin instead.
		 */
		articleTemplate: '<div class="article">' +
			'<div class="title">{{ title }}</div>' +
			'<div class="score">({{ readability }})</div>' +
			'<div class="extract">{{ extract }}{{^ extract }}' +
				'<span class="missing">** No article extract found **</span>{{/ extract }}' +
			'</div>' +
		'</div>',

		/**
		 * Render a list of articles into HTML.
		 *
		 * @param {Object[]} articles
		 */
		formatArticleLines: function (articles) {
			return $.map(articles, this.formatArticleLine);
		},

		/** @protected */
		formatArticleLine: function (article) {
			var params = article;
			return Mustache.render(Renderer.articleTemplate, params);
		}
	};
	return Renderer;
});

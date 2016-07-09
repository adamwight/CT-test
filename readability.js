define([
	"config",
	"lib/text_statistics.js"
], function (config) {

	/**
	 * Facade wrapping a readability scoring engine.
	 *
	 * @exports Readability
	 */
	var Readability = {
		/**
		 * Return a readability score for the given excerpt.
		 *
		 * @param {string} text
		 *
		 * @returns {Number} Score for this text.  The type of score is
		 * determined by the config.readabilityMeasure setting.
		 */
		score: function (text) {
			var stats = textStatistics(text);

			switch (config.readabilityMeasure) {
			case "flesch-kincaid":
				return stats.fleschKincaidReadingEase();
			case "automated-readability":
				return stats.automatedReadabilityIndex();
			default:
				// TODO: throw exception("No readability configured.")
				return null;
			}
		}
	};
	return Readability;
});

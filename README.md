Code challenge submission, in response to `https://www.mediawiki.org/wiki/User:Kaldari/Task_2`.

Hosted at https://adamwight.github.io/CT-test/

Limitations
===========
* No i18n support, English is hardcoded everywhere.
* No subcategory handling.
* No result pager, so we stop around 50 articles.
* Crappy aesthetics.
* Code might be better if it used promises, I'm still puzzling over lambda programming.
* Doesn't resolve article redirects.
* I didn't have enough time to find the healthiest and best third-party
  libraries, so I used a strategy of minimizing the interface with each.
* Occasional race condition, sometimes jquery cannot be loaded.


Licenses
========

Code by Adam Wight is CC-NC.

Contributed `lib`:
(MIT) https://github.com/brettz9/mediawiki-js
(MIT, patched by adamw) https://github.com/cgiffard/TextStatistics.js
(MIT) https://github.com/janl/mustache.js/blob/master/LICENSE
(CC0) https://github.com/requirejs/requirejs/blob/master/LICENSE
(MIT) https://github.com/requirejs/text
(MIT) https://jquery.org/license/
(CC0-ish) http://loading.io/ spinner

=======

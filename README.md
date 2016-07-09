Code challenge submission, in response to `https://www.mediawiki.org/wiki/User:Kaldari/Task_2`.

cat-ache (/KÆʔ eɪk/) - Review the most unreadable articles in a category.

Hosted at https://adamwight.github.io/cat-ache
Code at https://github.com/adamwight/cat-ache

Limitations
===========
* No automated tests.
* No i18n support, English is hardcoded everywhere.
* No subcategory handling.
* No result pager, so we stop around 50 articles.
* No way to invert sort.
* I didn't have enough time to find the healthiest and best third-party
  libraries, so I used a strategy of minimizing the interface with each.
* Note that we're usually fetching the first paragraph of the summary, not the
  first paragraph of the article body itself.


Licenses
========

Code by Adam Wight is CC-NC.

Contributed `lib`:
* (MIT) https://github.com/brettz9/mediawiki-js
* (MIT, patched by adamw) https://github.com/cgiffard/TextStatistics.js
* (MIT) https://github.com/janl/mustache.js/blob/master/LICENSE
* (CC0) https://github.com/requirejs/requirejs/blob/master/LICENSE
* (MIT) https://github.com/requirejs/text
* (MIT) https://jquery.org/license/
* (CC0-ish) http://loading.io/ spinner

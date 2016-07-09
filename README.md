cat-ache (/KÆʔ eɪk/) - Review the most unreadable articles in a category.

This is a code challenge submission, in response to https://www.mediawiki.org/wiki/User:Kaldari/Task_2 .

[hosted demo](https://adamwight.github.io/cat-ache)

[code](https://github.com/adamwight/cat-ache)

[docs](https://adamwight.github.io/cat-ache/doc/)

Limitations
===========
* No automated tests.
* No i18n support, English is hardcoded everywhere.
* No subcategory handling.
* We stop after the first c. 50 articles, so the most unreadable article is
  chosen out of that set only and remaining category members are omitted from
  the sort.
* No way to invert the sort.
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

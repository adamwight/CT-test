Code challenge submission, in response to `https://www.mediawiki.org/wiki/User:Kaldari/Task_2`.

Hosted at https://adamwight.github.io/CT-test/

Limitations
===========
* No i18n support, English is hardcoded everywhere.
* No subcategory handling.
* No result pager.
* Crappy aesthetics.
* Probably more readable if it used promises, I'm still puzzling over lambda programming.
* Doesn't resolve article redirects.
* I didn't have enough time to find the healthiest and best libraries, so took
  a strategy of minimizing the interface with each.



Licenses
========

Code by Adam Wight is CC-NC.

Contributed `lib`:
(MIT) https://github.com/brettz9/mediawiki-js
(MIT, patched by adamw) https://github.com/cgiffard/TextStatistics.js
	* TODO: include patch
(MIT) https://jquery.org/license/

=======

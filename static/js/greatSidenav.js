/*A simple adaptation of the classic Win95 mine game
  the Alarm Clock font is by David J. Patterson - https://www.dafont.com/alarm-clock.font
  CSS from https://clarity.design/ as well as jQuery from https://jquery.com/
*/
$(document).ready(function() {
var mysides = `<section class="sidenav-content">
<a href="http://www.greatarea.net" class="nav-link">
Home
</a>
<section class="nav-group collapsible">
<input id="tabexample1" type="checkbox">
<label for="tabexample1">Javascript Games</label>
<ul class="nav-list">
<li><a class="nav-link" href="mines-out.html">Mines</a></li>
<li><a class="nav-link" href="sud-out.html">Sudoku Solver</a></li>
</ul>
</section>
<section class="nav-group">
<input id="tabexample2" type="checkbox">
<label for="tabexample2">Default Nav Element</label>
<ul class="nav-list">
<li><a class="nav-link">Link 1</a></li>
<li><a class="nav-link">Link 2</a></li>
</ul>
</section>
</section>`;

$('#msidenav').html(mysides);
});
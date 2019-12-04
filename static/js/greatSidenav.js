$(document).ready(function() {
var mysides = `<section class="sidenav-content">
<a href="https://www.greatarea.net" class="nav-link">
Home
</a>
<section class="nav-group collapsible">
<input id="tabexample1" type="checkbox">
<label for="tabexample1">jquery lab</label>
<ul class="nav-list">
<li><a class="nav-link" href="mines-out.html" id="mines-link">Mines</a></li>
<li><a class="nav-link" href="sud-out.html" id="sud-link">Sudoku Solver</a></li>
</ul>
</section>
<section class="nav-group">
<input id="tabexample2" type="checkbox">
<label for="tabexample2">Vue lab</label>
<ul class="nav-list">
<li><a class="nav-link" href="vue1.html" id="vue1-link">VueLab1</a></li>
<li><a class="nav-link">Link 2</a></li>
</ul>
</section>
</section>`;

$('#msidenav').html(mysides);
});

/*Header for greatarea.net pages
*/

$(document).ready(function() {
  $('#ganav').html(`
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container">
      <a class="navbar-brand" rel="author" href="/">Great Area</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav ml-auto">
          <li>
            <div class="dropdown show">
              <a class="btn nav-link dropdown-toggle" data-toggle="dropdown">
                Games 
              </a>
            <div class="dropdown-menu">
              <a class="dropdown-item" href="gamines.html">Mines</a>
              <a class="dropdown-item" href="gasud.html">Sudoku Solver</a>
            </div>
            </div>
          </li>
          <li>
            <div class="dropdown show">
              <a class="btn nav-link dropdown-toggle" data-toggle="dropdown">
                Tools 
              </a> 
            <div class="dropdown-menu">
            <a class="dropdown-item" href="gafusker.html">Gallerizer</a>
            <a class="dropdown-item" href="gajsencry.html">Encryption</a>
            <a class="dropdown-item disabled" href="gastrsav.html">StreamSaver</a>
            </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </nav>
`);
});

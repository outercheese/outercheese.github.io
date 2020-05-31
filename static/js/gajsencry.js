/*Javascript encryption demo
  by Steven Mercer
  crypto-js is from https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/crypto-js.min.js
  original recipe https://medium.com/@jpatwa/java-encryption-javascript-decryption-using-aes-algorithm-4037ce09a2d3
*/

$(document).ready(function() {
  var extractedUrls;
  $('#mycontent').html(`<h3>Javascript encryption</h3>
    <div id="gadescrip">
      <p>This is a PoC of the encryption & hashing capabilities of javascript.<br>
      Encrypt a message using a password in the first tab, then decrypt in the second tab.<br>
    </div>
    <br>
    <ul class="nav nav-tabs">
      <li class="nav-item">
        <a class="nav-link" data-toggle="tab" href="#jsencry">Encryption</a>
      </li>
      <li class="nav-item">
        <a class="nav-link active" data-toggle="tab" href="#jsdecry">Decryption</a>
      </li>
    </ul>
    <div id="myTabContent" class="tab-content">
      <div class="tab-pane fade" id="jsencry">
        <p>This is the encryption tab content.</p>
      </div>
      <div class="tab-pane fade active show" id="jsdecry">
        <p>This is the decryption tab content.</p>
      </div>
    </div>
    <div id="logwin"></div>
  `);
  //$('#topbar').css("background-color", "lightgray");
  $('#fuskUrl').keydown(function() {
      if (event.keyCode == 13) {
        subUrl();
      return false;
    }
  });

  $('#urlSub').click(function() {
    subUrl();
    return false;
  }); 

  function subUrl() {
    var inUrl = $("#fuskUrl").val();
      if (inUrl == "") {
        alert("Enter a URL to fusker");
      } else {
        //$('#my_form').submit();
        procUrl($("#fuskUrl").val());
      }
      //$("textarea").val('');
      return false;
  };

  function procUrl(fuskUrl){
    var urlStart = fuskUrl.split('[')[0];
    var urlEnd = fuskUrl.split(']')[1];
    var urlRange = fuskUrl.split(']')[0].split('[')[1];
    extractedUrls = ''
    var i;
    for (i = urlRange.split('-')[0]; i <= urlRange.split("-")[1]; i++){
      extractedUrls = extractedUrls + ("<p><img class=\"img-fluid\" src=\"" + urlStart + i + urlEnd + "\"></img><br>" + urlStart + i + urlEnd + "</p>");
    }
    $('#logwin').html(extractedUrls);
    return false;
  };
});

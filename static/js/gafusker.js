/*A simple adaptation of the classic Win95 minesweeper game
  by Steven Mercer
  the Alarm Clock font is by David J. Patterson - https://www.dafont.com/alarm-clock.font
  CSS from https://clarity.design/ as well as jQuery from https://jquery.com/
*/

$(document).ready(function() {
   var extractedUrls;
   var cellrows = 9;
   var colorArray = {
       1: "#0000DD",
       2: "#00AA00",
       3: "#DD0000",
       4: "#000055",
       5: "#550000",
       6: "#000000",
       7: "#000000",
       8: "#000000"
    };
  $('#mycontent').html(`<h3>Fusker</h3>    
    <div id="gadescrip">
      <p>A fusker is a way to display a range of images in numerical sequence.<br>
      Input a URL, with the range of images separated by brackets<br>
      e.g. <code>https://www.google.com/images/hp[0-3].gif</code> will return a sequence of 4 images:<br>
      <code>hp0.gif</code>, <code>hp1.gif</code>, <code>hp2.gif</code>, <code>hp3.gif</code></p>
    </div>
    <br>
    <div class="form-group">
      <h5>URL to Fusker:</h5>
      <textarea class="form-control" id="fuskUrl" rows="1" style="max-width: 80%; height: 1.5rem; padding: 0.2rem;">https://www.google.com/images/hp[0-3].gif</textarea>
      <button type="button" class="btn btn-primary" style="height: 1.0rem; line-height: 0rem" id="urlSub">Submit</button>
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

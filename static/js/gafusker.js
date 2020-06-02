/*A simple javascript-based fusker
  by Steven Mercer
*/

$(document).ready(function() {
   var extractedUrls;
  $('#mycontent').html(`<h3>Fusker</h3>    
    <div id="gadescrip">
      <p>A fusker is a way to display a range of images in numerical sequence.<br>
      Input a URL, with the range of images separated by brackets<br>
      e.g. <code>https://www.google.com/images/hp[0-3].gif</code> will return a sequence of 4 images:<br>
      <code>hp0.gif</code>, <code>hp1.gif</code>, <code>hp2.gif</code>, <code>hp3.gif</code></p>
    </div>
    <br>
    <div class="form-group">
      <h5 style="margin-bottom: 0.05rem;">URL to Fusker:</h5>
      <textarea class="form-control" id="fuskUrl" name="fuskUrl" rows="1" style="max-width: 80%; height: 1.5rem; padding: 0.2rem; resize: none; margin-bottom: 0.2rem;" placeholder="e.g. https://www.google.com/images/hp[0-3].gif"></textarea>
      <button type="button" class="btn btn-primary" style="height: 1.0rem; line-height: 0rem; padding-left: 0.5rem; padding-right: 0.5rem;" id="urlSub">Submit</button>
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
      $("#logwin").html("<p class=\"text-danger\">Enter a URL to fusker.</p>")
    } else {
      //$('#my_form').submit();
      try{
        procUrl($("#fuskUrl").val());
        return false;
      }
      catch(err){
        console.log(err.message);
        if (err.message == "urlRange is undefined"){
          $("#logwin").html("<p class=\"text-danger\">Please specify a range with brackets.[]</p>")
        }
        else{
          $("#logwin").html("<p class=\"text-danger\">ERROR</p>")
        }
      }
    }
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

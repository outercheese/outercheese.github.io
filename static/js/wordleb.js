//load database
var uInt8Array
var db
var contents = "Steven Mercer 2022-06-24 www.stevenmercer.com"
config = {
  locateFile: filename => `static/js/sql-wasm.wasm`
}

initSqlJs(config).then(function(SQL){
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'static/data/wordle.db', true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = e => {
    uInt8Array = new Uint8Array(xhr.response);
    db = new SQL.Database(uInt8Array);
    contents = db.exec("SELECT * FROM wordlist LIMIT 5");
  };
  xhr.send();
});

//solver logic
var solvedW = ["_","_","_","_","_"];
var wrongPos = {};
var notInWord = [];
var qstr = [];
var guessRound = 0;

function choseWord(myWord){
  myGuess = '<div class="row">';
  for (i=0; i<myWord.length; i++)
  {
    myGuess = myGuess + '<div class="col-sm-1 unanswered letterBox" id=s' + guessRound + 'p' + i + ' data-letter="' + myWord[i] + '" data-posn="' + i + '" >' + myWord[i].toUpperCase() + '</div>&nbsp;';
  }
  myGuess = myGuess + '</div>';
  $('#guesses').append(myGuess);
  $( ".letterBox" ).on( "click", function() {
    answerPop(this);
  });
  $('#suggestions').html('');
}

//answering each square per guessed word
var answeredCt = 0;

function getNextFive(){
  wrongPos = {};
  $('.solved').each(function() {
    //console.log("solved " + $( this ).text().toLowerCase() + " " + $( this ).data("posn"));
    var idxw = parseInt($( this ).data("posn"));
    solvedW[idxw] = $( this ).text().toLowerCase();
  });
  $('.notInWord').each(function() {
    //console.log("notInWord " + $( this ).text().toLowerCase() + " " + $( this ).data("posn"));
    //console.log("niwCompare " + jQuery.inArray($( this ).text().toLowerCase(), solvedW));
    if (jQuery.inArray($( this ).text().toLowerCase(), notInWord) == -1){
        notInWord.push($( this ).text().toLowerCase());
    }
  });
  $('.wrongPos').each(function() {
    console.log("wrongPos " + $( this ).text().toLowerCase() + " " + $( this ).data("posn"));
    if (jQuery.inArray($( this ).text().toLowerCase(), Object.keys(wrongPos)) > -1){
      if (jQuery.inArray(parseInt($( this ).data("posn")),wrongPos[$( this ).text().toLowerCase()]) > -1){
        //console.log("already here in arr pos " + wrongPos[$( this ).text().toLowerCase()]);
      }
      else{
        //console.log("already here but not in arr");
        wrongPos[$( this ).text().toLowerCase()].push(parseInt($( this ).data("posn")));
      }
    }
    else{
      //console.log("need to add to wrongPos array");
      wrongPos[$( this ).text().toLowerCase()] = [parseInt($( this ).data("posn"))];
    }
    //console.log("wrongPos is now "+ Object.entries(wrongPos));
  });
  $( ".letterBox" ).unbind();
  $(".wrongPos").addClass('wPosAlt');
  $(".wrongPos").removeClass('wrongPos');
  
  //BUILD QUERY
  var cqry = '';
  for (x in notInWord){
    if (solvedW.includes(notInWord[x])){
      qstr.push('word NOT LIKE ("%' + notInWord[x] + '%' + notInWord[x] + '%")');
    }
    else{
      qstr.push('word NOT LIKE ("%' + notInWord[x] + '%")');
    }
  }
  
  wrongPosKeys = Object.keys(wrongPos)
  for (x in wrongPosKeys){
    if (solvedW.includes(wrongPosKeys[x])){
      qstr.push('word LIKE ("%' + wrongPosKeys[x] + '%' + wrongPosKeys[x] + '%")');
    }
    else { 
      qstr.push('word LIKE ("%' + wrongPosKeys[x] + '%")');
    }
    for (y in wrongPos[wrongPosKeys[x]]){
      nlstr = "";
        for (inx of Array(5).keys()){
          if (inx == wrongPos[wrongPosKeys[x]][y]){
            nlstr = nlstr + wrongPosKeys[x];
          }
          else{
            nlstr = nlstr + "_";
          } 
      }
      qstr.push('word NOT LIKE ("' + nlstr + '")');
    }
  }
  
  cqry = cqry + 'SELECT * FROM wordlist WHERE ';
  cqry = cqry + 'word LIKE ("' + solvedW.join("") + '") AND ';
  
  
  for (x in qstr){
    cqry = cqry + qstr[x] + " ";  
    if (x < (qstr.length - 1)){
      cqry = cqry + 'AND ';
    }
  }
  
  cqry = cqry + 'ORDER BY freqscore DESC ';
  cqry = cqry + 'LIMIT 10;';

  //console.log(cqry);
  
  //EXECUTE QUERY
  contents = db.prepare(cqry);
  contents.getAsObject({ $start: 1, $end: 1 });
  contents.bind({ $start: 1, $end: 2 });
  //console.log(contents);
  while (contents.step()) { 
    var row = contents.getAsObject();
    $('#suggestions').append('<div class="nextword" id="suggested" data-guess="'+ row["word"] + '">'+ row["word"] + '</div>');
  }
  $( ".nextword" ).on( "click", function() {
    choseWord( $( this ).text() );
  });  
}

function answerPop(squid){
  //alert(squid.id);
  $('.letterBox').popover('dispose');
  //mypop = '<div class="selContainer">';
  mypop = '<div class="unanswered selBox" id="clbx">clear</div>';
  mypop = mypop + '<div class="notInWord selBox" id="niwbx">not in word</div>';
  mypop = mypop + '<div class="wrongPos selBox" id="wrpbx">wrong position</div>';
  mypop = mypop + '<div class="solved selBox" id="slvbx">solved</div>';
  //mypop = mypop + '</div>';
  //console.log(mypop);
  function clearSel(btcs){
    $(btcs).removeClass();
    $(btcs).addClass('col-sm-1');
    $(btcs).addClass('unanswered');
    $(btcs).addClass('letterBox');   
  }
  
  $(squid).popover({
      container: 'body',
      content: '<div class="popover" role="tooltip"><h3 class="popover-header">' + $(squid).attr('id') + '</h3>' + mypop + '</div>',
      html: true
    });
  $(squid).popover('toggle');
  
  $('#clbx').on("click", function(){
    $('.letterBox').popover('dispose');
    clearSel(squid);
    var numUnans = $('.unanswered').length;
    //console.log(numUnans);
  });
  
  $('#niwbx').on("click", function(){
    $('.letterBox').popover('dispose');
    clearSel(squid);
    $(squid).removeClass('unanswered');
    $(squid).addClass('notInWord');
    if($('.unanswered').length == 0){
      getNextFive();
    };
  });

  $('#wrpbx').on("click", function(){
    $('.letterBox').popover('dispose');
    clearSel(squid);
    $(squid).removeClass('unanswered');
    $(squid).addClass('wrongPos');
    if($('.unanswered').length == 0){
      getNextFive();
    };
  });
  
  $('#slvbx').on("click", function(){
    $('.letterBox').popover('dispose');
    clearSel(squid);
    $(squid).removeClass('unanswered');
    $(squid).addClass('solved');
    if($('.unanswered').length == 0){
      getNextFive();
    };
  });  
  //$(squid).html('');
}

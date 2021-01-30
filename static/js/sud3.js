/* Sudoku Solver - solves sudoku puzzles.
    by Steven Mercer
    The Javascript front end makes calls to a Python script hosted at repl.it
    There is also drag-and-drop functionality for an xcel file, but I've turned that off for now.
*/

var propval;

//propobj is an object containing key:value pairs for known-solved squares
var propobj = {};
//couldbe is an array, each element of which is an array itself, of all possible vaules of a square
var couldbe = [];
//sudsquares is an array of arrays. each array lists the common row, block and column
var sudsquares = [];
//collection of squares for each of the aforementioned row, block, column
var squaresincol = [];
var squaresinrow = [];
var squaresinblk = [];
for (b=0; b<9; b++){
  squaresincol.push([]);
  squaresinrow.push([]);
  squaresinblk.push([]);
}

for (cb = 0; cb < 81; cb++){
  sudsquares.push([]);
  couldbe.push([1,2,3,4,5,6,7,8,9]);
  var tmpmycol = cb % 9;
  var tmpmyrow = Math.floor(cb/9);
  var tmpmyblk = Math.floor(tmpmycol / 3) + (3 * Math.floor(tmpmyrow / 3));
  sudsquares[cb].push([tmpmycol,tmpmyrow,tmpmyblk]);
  squaresincol[tmpmycol].push(cb);
  squaresinrow[tmpmyrow].push(cb);
  squaresinblk[tmpmyblk].push(cb);
}

var cb = "banana"
$(document).ready(function() {
  /* initialize board */

  $('#mycontent').html(`<h3>Sudoku Solver</h3>  
        <div id="mydiv">loading...</div>
        <div id="ohno" hidden></div>
        <div id="sudboard">
        <table class="table table-bordered table-sm tabouter">
          <tbody id="tbod">
          </tbody>
        </table>
        </div>
        <button type="button" class="btn btn-outline-dark btn-sm" onclick="hardReset()">Reset</button><p>
        <button type="button" class="btn btn-outline-dark btn-sm" onclick="solveNYThard()">Solve today's NYT hard puzzle</button>
    `);
    $.ajax('https://shamefulcomplicateddowngrade.outercheese.repl.co/wakey', {
      type: 'POST',  // http method
      data: { 'name':'Steven Mercer', 'time':'9am' }  // data to submit
    })
    .done(function(){
      $('#mydiv').html('The board will begin attempting to solve the sudoku once 23 of the squares have been assigned values.<p>It will continue to recalculate each time the value of a square is modified.<p>');
    })
    .fail(function(){
      $('#mydiv').html('an error has occurred');
    });
  
  
  $('#tbod').html("");
  for (i = 0; i < 9; i++) {
    $('#tbod').append('<tr id="tre' + i + '">');
    for (j = 0; j < 9; j++) {
      $('#tre' + i).append('<td id="trd' + ((i*9)+j).toString() + '" class="sudouter"></td>');
      $('#trd' + ((i*9)+j)).on("click",function(){gimmePop(this);});
/*      $('#tre' + i).popover({
        container: 'body',
        content: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-header">' + i + '</h3><div class="popover-body">' + i + '</div></div>',
        html: true
      })
*/
    }
    $('#tbod').append('</tr>');
  }

  function gimmePop(gpid){
    $('.sudouter').popover('dispose');
    mypop = '<table><tr>';

    if ($(gpid).attr('id').replace("trd","") in propobj){
      mypop = mypop + "<td><div id='sqClr' class='sqVlSel'>clear cell</div></td><script>$('#sqClr').click({setS: " + ($(gpid).attr('id').replace('trd','')) + "}, clrSq); </script>";
    }
    else{
      for (index = 0; index < couldbe[($(gpid).attr('id').replace("trd",""))].length; index++) {
          mypop = mypop + "<td style=\"border: 1px solid #DDDDDD;\"><div id='sqVa" + index + "' class='sqVlSel'>" + couldbe[($(gpid).attr('id').replace("trd",""))][index] + "</div></td>";
          mypop = mypop + "<script>$('#sqVa" + index + "').click({setS: " + ($(gpid).attr('id').replace('trd','')) + ", setV: " + couldbe[($(gpid).attr('id').replace("trd",""))][index] + "}, setSq)</script>";
      }
    }

    mypop = mypop + "</tr></table>"
    $(gpid).popover({
      container: 'body',
      content: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-header"> square ' + ($(gpid).attr('id').replace("trd","")) + '</h3><div class="popover-body">' + mypop + '</div></div>',
      html: true
    });
    $(gpid).popover('toggle');
    $('.sqVlSel').mouseenter(function(){$( this ).addClass('sqvalenter');});
    $('.sqVlSel').mouseleave(function(){$( this ).removeClass('sqvalenter');});
  }

  //drag-n-drop excel file
  //xcel parse code from SheetJS
  //https://github.com/SheetJS/sheetjs
  var drop = document.getElementById('drop')

  function handleDrop(e) {
    e.stopPropagation(); e.preventDefault();
    var files = e.dataTransfer.files, f = files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
      var data = new Uint8Array(e.target.result);
      var workbook = XLSX.read(data, {type: 'array'});

      //begin parsing spreadsheet
      var first_sheet_name = workbook.SheetNames[0];
      var address_of_cell = 'V12';

      /* Get worksheet */
      var worksheet = workbook.Sheets[first_sheet_name];

      /* Find desired cell */
      var desired_cell = worksheet[address_of_cell];

      /* Get the value */
      var desired_value = (desired_cell ? desired_cell.v : undefined);
      
      /* clear the board */
      resetBoard();
      /* populate property string element*/
      propval = desired_value;
      $('#propstr').val(desired_value);

      propobj = {};
      //uparr = desired_value.split(", ");
      uparr = propval.split(", ");
      $.each(uparr, function( index, value ) {
        propobj[value.split(":")[0]] = value.split(":")[1];
        $('#trd' + value.split(":")[0]).html( value.split(":")[1] );
        $('#trd' + value.split(":")[0]).addClass("sol-cell");
      });
      solveSud();
    };
    reader.readAsArrayBuffer(f);
  }

  function handleDragover(e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }

  if(drop.addEventListener) {
    drop.addEventListener('dragenter', handleDragover, false);
    drop.addEventListener('dragover', handleDragover, false);
    drop.addEventListener('drop', handleDrop, false);
  }

});

function recalcBoard() {
  couldbe = [];
  for (cb = 0; cb < 81; cb++){
    couldbe.push([1,2,3,4,5,6,7,8,9]);
  }
  for (const [key, value] of Object.entries(propobj)) {
    couldbe[key] = [value]
    $('#trd' + key).html(value);
    $('#trd' + key).addClass("sol-cell");
    
    for (const nsq of squaresincol[sudsquares[key][0][0]]){
      if ((nsq != key) && (couldbe[nsq].indexOf(value) > -1)){
        couldbe[nsq].splice(couldbe[nsq].indexOf(value),1);
      }
    }    
    for (const nsq of squaresinrow[sudsquares[key][0][1]]){
      if ((nsq != key) && (couldbe[nsq].indexOf(value) > -1)){
        couldbe[nsq].splice(couldbe[nsq].indexOf(value),1);
      }
    }    
    for (const nsq of squaresinblk[sudsquares[key][0][2]]){
      if ((nsq != key) && (couldbe[nsq].indexOf(value) > -1)){
        couldbe[nsq].splice(couldbe[nsq].indexOf(value),1);
      }
    }
  }
  if (Object.keys(propobj).length > 22){
    solveSud();
  }
}

function resetBoard() {
  //resets visual state of the board
  $('.sudouter').popover('dispose');
  $('.sudouter').html('');
  $('.sudouter').removeClass("sol-cell");
  $('.sudouter').removeClass("fig-cell");
  $('.sudouter').removeClass("bad-cell");
}

function hardReset() {
  propobj = {}
  resetBoard()
  recalcBoard()
}

function solveNYThard(){
  hardReset()
  //$('#misctxt').html('solving...');
    $.ajax({
      type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
      url         : 'https://shamefulcomplicateddowngrade.outercheese.repl.co/NYThard', // the url where we want to POST
      dataType    : 'json', // what type of data do we expect back from the server
      //encode      : true
  })
  .done(function(data) {
    // log data to the console so we can see
    // console.log(data); 
    if (Object.keys(data[0]).length > 0){
      //$('#misctxt').html("Solved!")
      //$('#misctxt').html(data[0]["NYThard"])
      nytharr = data[0]["NYThard"].split(',')
      $.each(nytharr, function( index, value ) {
        if (value > 0){
          propobj[index] = parseInt(value);
          resetBoard();
          recalcBoard();
        }
      });      
      console.log(nytharr)
      //console.log(propobj)
    }
    else{
      $('#ohno').html("an error occurred.")
    }
  });
}

function clrSq( sqev ){
  delete propobj[sqev.data.setS];
  resetBoard();
  recalcBoard();
}

function setSq( sqev ){
  propobj[sqev.data.setS] = sqev.data.setV;
  resetBoard();
  recalcBoard();
}

function solveSud(){
  $('#ohno').html("Solving...")

  propstr = '{'
  for (const [key, value] of Object.entries(propobj)) {
    //console.log(`${key}: ${value}`);
    if (propstr == '{'){
      propstr = propstr + `${key}:${value}`;
    }
    else {
       propstr = propstr + ", " + `${key}:${value}`;
    }
  }
  propstr = propstr + '}'

  var formData = {
    //"proposed": "{" + $('#propstr').val() + "}"
    //"proposed": "{" + propval + "}"
    "proposed": propstr
  }

  // process the form
  $.ajax({
      type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
      url         : 'https://shamefulcomplicateddowngrade.outercheese.repl.co/testin', // the url where we want to POST
      data        : formData, // our data object
      dataType    : 'json', // what type of data do we expect back from the server
      //encode      : true
  })
  .done(function(data) {
    // log data to the console so we can see
    // console.log(data); 
    if (Object.keys(data[0]).length > 0){
      $('#ohno').html("Solved!")
      $.each(data[0], function( index, value ) {
      $('#trd' + index).html( value );
      });
    }
    else{
      $('#ohno').html("Unable to solve.")
    }
  });

}

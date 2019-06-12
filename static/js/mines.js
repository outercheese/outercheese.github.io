/*A simple adaptation of the classic Win95 mine game
  the Alarm Clock font is by David J. Patterson - https://www.dafont.com/alarm-clock.font
  CSS from https://clarity.design/ as well as jQuery from https://jquery.com/
*/

$(document).ready(function() {
   var cellrows = 9;
   var cellcols = 12;
   var minecount = 0;
   var mytab = "";
   var sqarr = [];
   var squaresRevealed = 0;
   var gameEnded = 0;
   var clockWorker = new Worker('static/js/mclock.js');
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
  //$('#topbar').css("background-color", "lightgray");
  $('#minesb').html("<br><table><tr><td><div id='mclock' class='mclocker'>000</div></td><td><div id='faceStatus' class='faceStatus'>&#128578</div></td><td id='restarter' style='font-weight: bold'>restart</td></tr></table><div id='mboard'></div>");
  $('#mboard').html("<table id='mntab' class='tbbr'></table>");
  $('#mntab').css("border", "1");

  buildClock();
  buildBoard();

  function buildClock() {
    clockWorker.onmessage = function (e){
      $('#mclock').html(e.data.clockValue);};
    clockWorker.postMessage({'cmd': 'StartClock'});
  }

  function buildBoard() {
    for(var crow = 0; crow < cellrows; crow++){
        mytab = mytab + "<tr class='gtr'>"
      for(var ccol = 0; ccol < cellcols; ccol++){
        //generate cell
        mytab = mytab + "<td id='s" + (ccol + (crow * cellcols)).toString() + "' class='plsq'></td>";
        //push square to array
        sqarr.push({isRevealed:0,isMine:0,isFlagged:0,neighMines:0,neighbArr:getNeighbors((ccol + (crow * cellcols)),crow,ccol)});
      }
      mytab = mytab + "</tr>\n"
    }

    $('#mntab').html(mytab);
    $('#mboard').contextmenu(function() {
      return false;
    });
    $('.plsq').click(function() {
      sqLcl(this);
    });
    $('.plsq').contextmenu(function() {
      sqRcl(this);
    });
    $('#restarter').click(function(){
       $('#topbar').css("color", "rgb(9,9,9)");
       $('#topbar').html("<b>Mines</b>");
       $('#faceStatus').html("&#128578");
       clockWorker.postMessage({'cmd': 'StopClock'});
       $('#mclock').html("000");
       cellrows = 9;
       cellcols = 12;
       minecount = 0;
       mytab = "";
       sqarr = [];
       squaresRevealed = 0;
       gameEnded = 0;
      buildClock();
      buildBoard();
    });
    for(var sqebl = 0; sqebl < (cellrows * cellcols); sqebl++) {
      var rmin = 0;
      var rmax = 9;
      var random = Math.floor(Math.random() * (+rmax - +rmin)) + +rmin;
      if (random == 5){
        setMine(sqebl);
      }
    }

  }

  function getNeighbors(gsqu, gcrow, gccol){
    var carr = [];
    var rarr = [];
    var tmpNeighList = [];
    if (gcrow > 0){rarr.push(gcrow - 1)}
    if (gccol > 0){carr.push(gccol - 1)}
    rarr.push(gcrow);
    carr.push(gccol);
    if (gcrow < (cellrows-1)){rarr.push(gcrow + 1)}
    if (gccol < (cellcols-1)){carr.push(gccol + 1)}
    rarr.forEach(function(rentry) {
      carr.forEach(function(centry) {
        if ((centry + (rentry * cellcols)) != gsqu){
          tmpNeighList.push(centry + (rentry * cellcols));
        }
      });
    });
    return tmpNeighList;
  }

  function setMine(gsqu){
    sqarr[gsqu].isMine=1;
    sqarr[gsqu].neighbArr.forEach(function(mneigh){
      sqarr[mneigh].neighMines = sqarr[mneigh].neighMines + 1;
    }); 
    minecount = minecount + 1;
  }

  function sqLcl(clicked_val) {
    var tmpv = $(clicked_val).attr('id');
    var clksq = tmpv.split("s")[1];
    if (sqarr[clksq].isMine && !(sqarr[clksq].isFlagged)){
      $(clicked_val).css("background-color", "rgb(255,0,0)");
      gameOver();
    }
    else if(!sqarr[clksq].isRevealed && !(sqarr[clksq].isFlagged)){
      reveal(clicked_val);
    }
  }

  //Right-click on a square, toggle Flag
  function sqRcl(clicked_val) {
    var tmpv = $(clicked_val).attr('id');
    var clksq = tmpv.split("s")[1];
    //toggle Flag
    if (sqarr[clksq].isRevealed == 0){
      if (sqarr[clksq].isFlagged == 1){
        sqarr[clksq].isFlagged = 0;
        $(clicked_val).css("font-size", "21px");
        $(clicked_val).html("");
      }
      else{
        sqarr[clksq].isFlagged = 1;
        $(clicked_val).css("font-size", "12px");
        $(clicked_val).html("<b>&#128681</b>");  
      }
    }
  }

  function reveal(rsq) {
    var rtmpv = $(rsq).attr('id');
    var rclksq = rtmpv.split("s")[1];
    if(!sqarr[rclksq.isRevealed]){
      if (sqarr[rclksq].isMine){
        $(rsq).css("background-image", 'none');
        $(rsq).css("font-size", "12px");
        $(rsq).html("<b>&#128163;</b>");
      }
      else if (sqarr[rclksq].neighMines > 0){
        $(rsq).css("background-image", 'none');
        $(rsq).css("color", colorArray[sqarr[rclksq].neighMines]);
        //console.log(colorArray[sqarr[rclksq].neighMines]);
        $(rsq).css("font-size", "21px");
        $(rsq).html("<b>" + sqarr[rclksq].neighMines + "</b>");
        $(rsq).css("background-color", "#DDDDDD");

      }
      else {
        $(rsq).html("");
        $(rsq).css("background-image", 'none');
        $(rsq).css("background-color", "#DDDDDD");
      }
    }
    sqarr[rclksq].isRevealed = 1;
    squaresRevealed = squaresRevealed + 1;
    if ((squaresRevealed == (cellcols * cellrows) - minecount) && !gameEnded){
      gameWin();
    }
    //if sq has no neighboring mines, reveal all neighbors
    if ((sqarr[rclksq].neighMines == 0) && !sqarr[rclksq].isMine){
      sqarr[rclksq].neighbArr.forEach(function(mneigh){
        if (!(sqarr[mneigh].isRevealed)){
          reveal('#s' + mneigh);
        }
      });
    }
  }

  function gameOver() {
    $('#topbar').css("color", "rgb(255,0,0)");
    $('#topbar').html("<b>Game Over</b>");
    $('#faceStatus').html("&#128565");
    clockWorker.postMessage({'cmd': 'StopClock'});
    gameEnded = 1;
    for(var sqend = 0; sqend < (cellrows * cellcols); sqend++) {
      if (sqarr[sqend].isMine){        
        reveal('#s' + sqend);
      }
    }
  }

  function gameWin(){
    $('#topbar').css("color", "rgb(0,192,0)");
    $('#topbar').html("<b>Congratulations!</b>");
    $('#faceStatus').html("&#128526");
    clockWorker.postMessage({'cmd': 'StopClock'});
  }
});

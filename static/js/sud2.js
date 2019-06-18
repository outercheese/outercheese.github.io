//sudoku solver
$(document).ready(function() {
   var sudhistory = [];
   var rollbackTo = 0;
   var solvtally = 0;
   sudsquares = [];
   solsquares = [];
   squaresincol = [];
   squaresinrow = [];
   squaresinblk = [];
   var keepchecking = 1;
   var timenow = new Date();

   for (b=0; b<9; b++){
      squaresincol.push([]);
      squaresinrow.push([]);
      squaresinblk.push([]);
   }

   for (b=0; b<81; b++){
      solsquares.push(0);
      sudsquares.push([]);
      sudsquares[b].push([1,1,1,1,1,1,1,1,1]);
      tmpcolrowblk=[];
      var tmpmycol = b % 9;
      var tmpmyrow = Math.floor(b/9);
      var tmpmyblk = Math.floor(tmpmycol / 3) + (3 * Math.floor(tmpmyrow / 3));
      sudsquares[b].push([tmpmycol,tmpmyrow,tmpmyblk]);
      squaresincol[tmpmycol].push(b);
      squaresinrow[tmpmyrow].push(b);
      squaresinblk[tmpmyblk].push(b);
   }

   $.fn.extend({ sudsolv:
      function() {
         $('#sudx').html("<div id='board'></div>");
         $('#board').css({position:'absolute', width: '810px', height: '810px' });

         for (b=0; b<81; b++){
            var myposleft = (b % 9) * 53;
            var mypostop = Math.floor(b/9) * 53; 
            $('#board').append("<div id='s" + b + "'>" + "</div>");
            $('#s' + b).css({position:'absolute', left: myposleft, top: mypostop, width: '53px', height: '53px', border: '3px solid black' });
            $('#s' + b).css("background-color","white");
            $('#s' + b).css("text-align", "center");
            for (v=0; v<9; v++){
              var spacerval = 0;
              var valposleft = ((v % 3 ) * 16);
              var valpostop = (Math.floor(v/3) * 16);
              $('#s' + b).append("<div id='s" + b + "v" + v + "'>" + "</div>");
              $('#s' + b + 'v' + v).css({position:'absolute', left: valposleft, top: valpostop, width: '16px', height: '16px' });
              $('#s' + b + 'v' + v).css("text-align", "center");
              $('#s' + b + 'v' + v).css("background-image", "url('static/images/vals.png')");
              $('#s' + b + 'v' + v).css("background-position", "0px -" + ((v * 20) +21) + "px");
              $('#s' + b + 'v' + v).click(function() {
                 valcl(this);
              });
            }
         }
         $('#sudx').append("<div id='sudbutts'></div>");
         $('#sudbutts').css({position:'absolute', left: '180px', top: '640px', width: '90px', height: '90px' });
         $('#sudbutts').append("<div id='sudundo'><b>Undo</b></div><p><div id='sudreset'><b>Reset</b></div><div id='sudcontem'><b>Solve</b></div>");
         $('#sudundo').css({position:'absolute', left: '30px', top: '0px', width: '90px', height: '20px', border: '1px solid black' });
         $('#sudundo').css("text-align", "center");
         $('#sudundo').click(function(){
             undoLast();
         });
         $('#sudreset').css({position:'absolute', left: '300px', top: '0px', width: '90px', height: '20px', border: '1px solid black' });
         $('#sudreset').css("text-align", "center");
         $('#sudreset').click(function(){
             sudhistory = [];
             initSquares();
             $('#sudx').html("");
             $('#sudx').sudsolv();
         });
         $('#sudcontem').css({position:'absolute', left: '420px', top: '0px', width: '90px', height: '20px', border: '1px solid black' });
         $('#sudcontem').css("text-align", "center");
         $('#sudcontem').click(function(){
             contemplateSud();
         });
         $('#sudcontem').hide();
      }
   });
   
   function valcl(clicked_val) {
     var tmpvar = $(clicked_val).attr('id');
     var splitval = tmpvar.split("v");
     var clksq = parseInt(splitval[0].split("s")[1]);
     var clkvl = parseInt(splitval[1]) + 1;
     solvedSq(clksq, clkvl, 1);
     while (keepchecking > 0){
        keepchecking = 0;
        chkSqMustBe();
        chkNumInChunk();
     } 
     validateLast(clksq, clkvl);
     if (solvtally > 27){
         $('#sudcontem').show();
     }
   }
   
   function solvedSq(slvsq, slvvl, ismanu){
      solvtally = solvtally + 1;
      if(ismanu < 1){
         $('#s' + slvsq).css("color", "blue");  
      }
      else{
         sudhistory.push([slvsq,slvvl]);
      }
      $('#s' + slvsq).html("<h3>" + slvvl + "</h3>"); 
 
      solsquares[slvsq] = slvvl;
      sudsquares[slvsq][0] = [0,0,0,0,0,0,0,0,0];
      sudsquares[slvsq][0][slvvl - 1] = 1; 
      for (relidx=0; relidx<9; relidx++){
            if ((squaresincol[sudsquares[slvsq][1][0]][relidx] != slvsq) && (solsquares[squaresincol[sudsquares[slvsq][1][0]][relidx]] == 0)){
              sudsquares[squaresincol[sudsquares[slvsq][1][0]][relidx]][0][slvvl - 1] = 0;
              $('#s' + squaresincol[sudsquares[slvsq][1][0]][relidx] + 'v' + [slvvl - 1]).css("background-position", "0px 0px");
              $('#s' + squaresincol[sudsquares[slvsq][1][0]][relidx] + 'v' + [slvvl - 1]).remove(); 
            } 
            if ((squaresinrow[sudsquares[slvsq][1][1]][relidx] != slvsq) && (solsquares[squaresinrow[sudsquares[slvsq][1][1]][relidx]] == 0)){
              sudsquares[squaresinrow[sudsquares[slvsq][1][1]][relidx]][0][slvvl - 1] = 0;
              $('#s' + squaresinrow[sudsquares[slvsq][1][1]][relidx] + 'v' + [slvvl - 1]).css("background-position", "0px 0px");
              $('#s' + squaresinrow[sudsquares[slvsq][1][1]][relidx] + 'v' + [slvvl - 1]).remove();
            }
            if ((squaresinblk[sudsquares[slvsq][1][2]][relidx] != slvsq) && (solsquares[squaresinblk[sudsquares[slvsq][1][2]][relidx]] == 0)){
              sudsquares[squaresinblk[sudsquares[slvsq][1][2]][relidx]][0][slvvl - 1] = 0;
              $('#s' + squaresinblk[sudsquares[slvsq][1][2]][relidx] + 'v' + [slvvl - 1]).css("background-position", "0px 0px");
              $('#s' + squaresinblk[sudsquares[slvsq][1][2]][relidx] + 'v' + [slvvl - 1]).remove();
            }
      }
      keepchecking = 1;
   } 
   
   function chkSqMustBe(){
      for (b=0;b<81;b++){
         tmptot = 0;
         $.each(sudsquares[b][0], function(si,sv) {
             tmptot = tmptot + sv;
         });
         if((tmptot == 1) && (solsquares[b] == 0)){
            solvedSq(b, (sudsquares[b][0].indexOf(1) + 1), 0); 
         } 
      }
   }  

   function chkNumInChunk(){
      for (b=0;b<9;b++){
          for (c=0;c<9;c++){
             tmpcolarr = [];
             $.each(squaresincol[c], function(si,sv) {
                if (sudsquares[sv][0][b] == 1) {
                   tmpcolarr.push(sv); 
                };
             });
             if ((tmpcolarr.length == 1) && (solsquares[tmpcolarr[0]] == 0)){
                solvedSq(tmpcolarr[0], b + 1, 0);
             };
          };
          for (c=0;c<9;c++){
             tmprowarr = [];
             $.each(squaresinrow[c], function(si,sv) {
                if (sudsquares[sv][0][b] == 1) {
                   tmprowarr.push(sv);
                };
             });
             if ((tmprowarr.length == 1) && (solsquares[tmprowarr[0]] == 0)){
                solvedSq(tmprowarr[0], b + 1, 0);
             };
          };
          for (c=0;c<9;c++){
             tmpblkarr = [];
             $.each(squaresinblk[c], function(si,sv) {
                if (sudsquares[sv][0][b] == 1) {
                   tmpblkarr.push(sv);
                };
             });
             if ((tmpblkarr.length == 1) && (solsquares[tmpblkarr[0]] == 0)){
                solvedSq(tmpblkarr[0], b + 1, 0);
             };
          };
           
      }
   }   

   function initSquares(){
      sudsquares = [];
      solsquares = [];
      squaresincol = [];
      squaresinrow = [];
      squaresinblk = [];
      var keepchecking = 1;
      solvtally = 0;
      for (b=0; b<9; b++){
         squaresincol.push([]);
         squaresinrow.push([]);
         squaresinblk.push([]);
      }

      for (b=0; b<81; b++){
         solsquares.push(0);
         sudsquares.push([]);
         sudsquares[b].push([1,1,1,1,1,1,1,1,1]);
         tmpcolrowblk=[];
         var tmpmycol = b % 9;
         var tmpmyrow = Math.floor(b/9);
         var tmpmyblk = Math.floor(tmpmycol / 3) + (3 * Math.floor(tmpmyrow / 3));
         sudsquares[b].push([tmpmycol,tmpmyrow,tmpmyblk]);
         squaresincol[tmpmycol].push(b);
         squaresinrow[tmpmyrow].push(b);
         squaresinblk[tmpmyblk].push(b);
      }

   }

   function undoLast(){
          initSquares();
          $('#sudx').html("");
          $('#sudx').sudsolv();
          var tmphist = sudhistory.slice();
          sudhistory = [];
          limitidx = tmphist.length - 1;
          for (histidx=0; histidx < limitidx; histidx++) {
              solvedSq(tmphist[histidx][0], tmphist[histidx][1], 1);
          }
          keepchecking = 1;
          while (keepchecking > 0){
              keepchecking = 0;
              chkSqMustBe();
              chkNumInChunk();
          }
   }

   function validateLast(validSq,validVal){
      var isValid = 1;
      for (b=0; b<81; b++){
         if (sudsquares[b][0].valueOf() == "0,0,0,0,0,0,0,0,0"){
            isValid = 0;
         }
      }
      if (isValid == 0){
         undoLast();
         sudsquares[validSq][0][validVal - 1] = 0;
         alert("nope");
      }
   }

   function contemplateSud(){
      for (cSb=0; cSb<81; cSb++){
          if ((solsquares[cSb] == 0) && ((((sudsquares[cSb][0].slice()).sort()).reverse()).indexOf(0) == 2)){
             var legitFound = 0;
             var badMove = 0;
             var tmpcontarr = []; 
             for (cSc=0;cSc<9;cSc++){
                if (sudsquares[cSb][0][cSc] == 1) {
                   cvl = cSc + 1;
                   tmpcontarr.push([cSb,cvl]);
                }
             }
             for (tryval=0; tryval < tmpcontarr.length; tryval++){
                sudhistory.push([tmpcontarr[tryval][0], tmpcontarr[tryval][1]]);
                solvedSq((tmpcontarr[tryval][0]), (tmpcontarr[tryval][1]), 0);
                while (keepchecking > 0){
                   keepchecking = 0;
                   chkSqMustBe();
                   chkNumInChunk();
                }
                if ((((solsquares.slice()).sort()).reverse()).indexOf(0) < 0){
                  $('#sudhead').css("color", "green");
                  $('#sudhead').html("<h2>Solved!</h2><p>");
                   return(0);
                }
                   undoLast();
             }
          }
      }
      $('#sudhead').css("color", "black");
      $('#sudhead').html("<h2>Sudoku Solver</h2><p>");
   } 

   $('#sudx').sudsolv();
   $('#logwin').css({position:'absolute', left: '30px', top: '630px', width: '810px', height: '90px', border: 'none' });
});


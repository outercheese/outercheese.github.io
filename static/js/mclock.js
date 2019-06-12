var n = 1;
var ticking = 0;
var myVar;
var nstr;
//var myTimer = new Date(null);

function StartClock(){
  
  CountUp();
}

function CountUp(){
    if (ticking >0){
    //console.log(n);
    //myTimer.setSeconds(n);
    //postMessage({'clockValue': myTimer.toISOString().substr(14, 5)});
    if (n < 10){
      nstr = "00" + n.toString();
    }
    else if (n < 100){
      nstr = "0" + n.toString();
    }
    else{
      nstr = n.toString();
    }
    postMessage({'clockValue': nstr});
    n = n + 1;
    if (n > 300){
      ticking = 0;
      clearInterval(myVar);
    }
  }
}

onmessage = function(e) {
  //console.log('got message ' + e.data.cmd)
  if (e.data.cmd == "StartClock"){
    ticking = 1;
    n = 1;
    myVar= setInterval(CountUp, 1000)
  }
  if (e.data.cmd == "StopClock"){
    ticking = 0;
    clearInterval(myVar);
  }
}

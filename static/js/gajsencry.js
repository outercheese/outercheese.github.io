/*Javascript encryption demo
  by Steven Mercer
  built with Stanford JavaScript Crypto Library from http://bitwiseshiftleft.github.io/sjcl/
*/
var plainTxtPwd='';
var plainTxtMsg='';
var encTxtMsg;

$(document).ready(function() {
  $('#mycontent').html(`<h3>Javascript encryption</h3>
    <div id="gadescrip">
      <p>This showcases some of the features of the <a href="http://bitwiseshiftleft.github.io/sjcl/">Stanford JavaScript Crypt Library</a><br>
      They have a swell <a href="http://bitwiseshiftleft.github.io/sjcl/demo/">demo</a> page which explains each parameter.<br>
      Encrypt a message using a password in the first tab, then decrypt in the second tab.<br>
    </div>
    <br>
    <ul class="nav nav-tabs">
      <li class="nav-item">
        <a class="nav-link active" data-toggle="tab" href="#jsencry">Encryption</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" data-toggle="tab" href="#jsdecry">Decryption</a>
      </li>
    </ul>
    <div id="myTabContent" class="tab-content">
      <div class="tab-pane fade active show" id="jsencry">
          <br>Modify the following parameters as needed, then Encrypt.<br><br>
          <table class="table-bordered">
            <thead class="thead-light">
              <tr><th class="shortyBox">Param</th><th class="shortyBox">value</th></tr>
            </thead>
            <tr>
              <td class="shortyBox">password</td>
              <td class="shortyBox"><textarea class="form-control" id="plainTxtPwd" name="plainTxtPwd" rows="1" cols="45" style="padding: 0rem; resize: none;" placeholder="enter a password here">ChangeThisPassw0rd</textarea></td>
            </tr>
            <tr>
              <td class="shortyBox">iterations</td>
              <td class="shortyBox"><textarea class="form-control" id="miterations" name="miterations" rows="1" style="padding: 0rem; resize: none;" placeholder="minimum 101 iterations">9999</textarea></td>
            </tr>
            <tr>
              <td class="shortyBox">key size</td>
              <td> <div class="form-check">
              <label class="form-check-label">
                <input type="radio" class="form-check-input" name="mkeysize" id="ekeys256" value="256" checked="">
                256
              </label>
              </div>
              <div class="form-check">
              <label class="form-check-label">
                  <input type="radio" class="form-check-input" name="mkeysize" id="ekeys192" value="192">
                  192
                </label>
              </div>
              <div class="form-check disabled">
              <label class="form-check-label">
                  <input type="radio" class="form-check-input" name="mkeysize" id="ekeys128" value="128">
                  128
                </label>
              </div></td>
            </tr>
            <tr>
              <td class="shortyBox">mode</td>
              <td> <div class="form-check">
              <label class="form-check-label">
                <input type="radio" class="form-check-input" name="mmode" id="mmode1" value="gcm" checked="">
                gcm
              </label>
              </div>
              <div class="form-check">
              <label class="form-check-label">
                  <input type="radio" class="form-check-input" name="mmode" id="mmode2" value="ccm">
                  ccm
                </label>
              </div></td>
            </tr>
          </table>
          <br>
          The message to be encrypted:
          <textarea class="form-control" id="plainTxtMsg" name="plainTxtMsg" rows="1" style="max-width: 90%; height: 1.5rem; padding: 0rem; resize: none; margin-bottom: 0.2rem;" placeholder="the message you want to encrypt here">Be sure to drink your Ovaltine</textarea>
          <button type="button" class="btn btn-primary" style="height: 1.0rem; line-height: 0rem; padding-left: 0.5rem; padding-right: 0.5rem;" id="encBut">Encrypt</button>
          <div id="encTxtArea">
          </div>
      </div>
      <div class="tab-pane fade show" id="jsdecry">
          <br>The following fields are autopopulated from the Encrypt funcion, but they can be modified manually as well.<br><br>
          <table class="table-bordered">
            <thead class="thead-light">
              <tr><th class="shortyBox">Param</th><th class="shortyBox">value</th></tr>
            </thead>
            <tr>
              <td class="shortyBox">password</td>
              <td class="shortyBox"><textarea class="form-control" id="decPlainTxtPwd" name="decPlainTxtPwd" rows="1" cols="45" style="padding: 0rem; resize: none;" placeholder="enter a password here">ChangeThisPassw0rd</textarea></td>
            </tr>
            <tr>
              <td class="shortyBox">iterations</td>
              <td class="shortyBox"><textarea class="form-control" id="decIterations" name="diterations" rows="1" style="padding: 0rem; resize: none;" placeholder="minimum 101 iterations">9999</textarea></td>
            </tr>
            <tr>
              <td class="shortyBox">key size</td>
              <td> <div class="form-check">
              <label class="form-check-label">
                <input type="radio" class="form-check-input" name="dKeysize" id="dkeys256" value="256" checked="">
                256
              </label>
              </div>
              <div class="form-check">
              <label class="form-check-label">
                  <input type="radio" class="form-check-input" name="dKeysize" id="dkeys192" value="192">
                  192
                </label>
              </div>
              <div class="form-check disabled">
              <label class="form-check-label">
                  <input type="radio" class="form-check-input" name="dKeysize" id="dkeys128" value="128">
                  128
                </label>
              </div></td>
            </tr>
            <tr>
              <td class="shortyBox">mode</td>
              <td> <div class="form-check">
              <label class="form-check-label">
                <input type="radio" class="form-check-input" name="dMode" id="dmodegcm" value="gcm" checked="">
                gcm
              </label>
              </div>
              <div class="form-check">
              <label class="form-check-label">
                  <input type="radio" class="form-check-input" name="dMode" id="dmodeccm" value="ccm">
                  ccm
                </label>
              </div></td>
            </tr>
            <tr>
              <td class="shortyBox">iv</td>
              <td class="shortyBox"><textarea class="form-control" id="decIv" name="decIv" rows="1" style="padding: 0rem; resize: none;" placeholder="initialization vector"></textarea></td>
            </tr>
            <tr>
              <td class="shortyBox">crypt text</td>
              <td class="shortyBox"><textarea class="form-control" id="cryptMsg" name="cryptMsg" rows="1" style="padding: 0rem; resize: none;" placeholder="encrypted text"></textarea></td>
            </tr>
          </table>
          <br>
          <button type="button" class="btn btn-primary" style="height: 1.0rem; line-height: 0rem; padding-left: 0.5rem; padding-right: 0.5rem;" id="decBut">Decrypt</button>
          <div id="decTxtArea">
        </div>
      </div>
    </div>
    <div id="logwin"></div>
  `);
  //console.log('crypto-js', CryptoJS);
  //console.log ("htcontent " + $('#jsencry').html());

  $('#encBut').click(function() {
    encryptThis();
    return false;
  }); 

  $('#decBut').click(function() {
    decryptThis();
    return false;
  });

  function encryptThis() {
    $('#decTxtArea').html('');
    plainTxtPwd = $("#plainTxtPwd").val();
    plainTxtMsg = $("#plainTxtMsg").val();
    if (plainTxtPwd == "") {
      alert("Enter an encryption key");
    } else if (plainTxtMsg == "") {
      alert("Enter a message to encrypt");
    } else {
      //encTxtMsg = JSON.parse(sjcl.encrypt(plainTxtPwd,plainTxtMsg));
      let cprams = {
        mode: $("input[name='mmode']:checked").val(),
        iter: parseInt($("#miterations").val(), 10),
        ks: parseInt($("input[name='mkeysize']:checked").val(), 10),
      }
      encTxtMsg = sjcl.encrypt(plainTxtPwd,plainTxtMsg,cprams);
      //console.log(JSON.parse(encTxtMsg));
      $('#encTxtArea').html("<br><h5>Encrypted object</h5>" + encTxtMsg);
      $('#decPlainTxtPwd').val(plainTxtPwd);
      $('#decIterations').val(JSON.parse(encTxtMsg)["iter"]);
      $("#dkeys" + JSON.parse(encTxtMsg)["ks"]).prop("checked", true);
      $("#dmode" + JSON.parse(encTxtMsg)["mode"]).prop("checked", true);
      $('#decIv').val(JSON.parse(encTxtMsg)["iv"]);
      $('#cryptMsg').val(JSON.parse(encTxtMsg)["ct"]);
      //$('#decObject').val(encTxtMsg);
      //console.log(JSON.parse(encTxtMsg)["iv"]);
    }
    //$("textarea").val('');
    return false;
  };

  function decryptThis(){
    decPlainTxtPwd = $("#decPlainTxtPwd").val();
    cryptMsg = $("#cryptMsg").val();
    decIv = $("#decIv");
    decMode = $("input[name='dMode']:checked").val();
    let dprams = {
      iv: $('#decIv').val(),
      iter: parseInt($("#decIterations").val(), 10),
      ks: parseInt($("input[name='dKeysize']:checked").val(), 10),
      mode: decMode,
      ct: cryptMsg,
    }
    if (decPlainTxtPwd == "" || cryptMsg == "" || decIv == ""){
      alert("fill in yo fields");
    }
    try{
      $('#decTxtArea').html("<br><h5>Decrypted message</h5>" + sjcl.decrypt(decPlainTxtPwd,JSON.stringify(dprams)));
      //$('#logwin').html('<script>' + sjcl.decrypt($('#decPlainTxtPwd').val(),$('#decObject').val()) + '</script>');
      //xconsole.log(sjcl.decrypt(plainTxtPwd,encTxtMsg));
    }
    catch(err){
      $('#decTxtArea').html("<p class=\"text-danger\">ERROR: Unable to decrypt." + "</p>");
      console.log("zoop - " + err.message + JSON.stringify(dprams));
    }
    return false;
  }
});

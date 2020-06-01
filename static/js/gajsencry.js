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
      <p>This is a PoC of the encryption & hashing capabilities of javascript.<br>
      This utilizes the <a href="http://bitwiseshiftleft.github.io/sjcl/">Stanford JavaScript Crypt Library</a><br>
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
          Enter password here:
          <textarea class="form-control" id="plainTxtPwd" name="plainTxtPwd" rows="1" style="max-width: 90%; height: 1.5rem; padding: 0rem; resize: none; margin-bottom: 0.2rem;" placeholder="enter the password here">MyWeakPassw0rd</textarea>
          <br>
          Enter message to encrypt:
          <textarea class="form-control" id="plainTxtMsg" name="plainTxtMsg" rows="1" style="max-width: 90%; height: 1.5rem; padding: 0rem; resize: none; margin-bottom: 0.2rem;" placeholder="write the message you want to encrypt here">Be sure to drink your Ovaltine</textarea>
          <button type="button" class="btn btn-primary" style="height: 1.0rem; line-height: 0rem; padding-left: 0.5rem; padding-right: 0.5rem;" id="encBut">Encrypt</button>
          <div id="encTxtArea">
          </div>
      </div>
      <div class="tab-pane fade show" id="jsdecry">
        Enter password here:
        <textarea class="form-control" id="decPlainTxtPwd" name="decPlainTxtPwd" rows="1" style="max-width: 90%; height: 1.5rem; padding: 0rem; resize: none; margin-bottom: 0.2rem;" placeholder="enter the password here">MyWeakPassw0rd</textarea>
        <br>
        Object to decrypt:
        <textarea class="form-control" id="decObject" name="decObject" rows="1" style="max-width: 90%; height: 1.5rem; padding: 0rem; resize: none; margin-bottom: 0.2rem;" placeholder="write the message you want to encrypt here"></textarea>
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
    plainTxtPwd = $("#plainTxtPwd").val();
    plainTxtMsg = $("#plainTxtMsg").val();
      if (plainTxtMsg == "") {
        alert("Enter an encryption key");
      } else if (plainTxtPwd == "") {
        alert("Enter a message to encrypt");
      } else {
        //encTxtMsg = JSON.parse(sjcl.encrypt(plainTxtPwd,plainTxtMsg));
        encTxtMsg = sjcl.encrypt(plainTxtPwd,plainTxtMsg);
        //console.log(JSON.parse(encTxtMsg));
        $('#encTxtArea').html("<br><h5>Encrypted object</h5>" + encTxtMsg);
        $('#decPlainTxtPwd').val(plainTxtPwd);
        $('#decObject').val(encTxtMsg);
      }
      //$("textarea").val('');
      return false;
  };

  function decryptThis(){
    $('#decTxtArea').html("<br><h5>Decrypted message</h5>" + sjcl.decrypt($('#decPlainTxtPwd').val(),$('#decObject').val()));
    //console.log(sjcl.decrypt(plainTxtPwd,encTxtMsg));
  }
});

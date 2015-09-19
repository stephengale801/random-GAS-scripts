/* The  Sub accounts listed in "getSubs()" have their passwords reset
The Manager accounts have the reset password emailed to them. 
The variables are given objects referencing each respective value (sub, manager)
Sub accounts get different passwords since the ChangePassword() function is called for each organization. 
*/
function getSubs(){
  var hs = {sub:"hs.sub@wgsd.us",  //HS Sub Account
            manager:"clarkk@wgsd.us"} //HS Secretary
  var ms = {sub:"ms.sub@wgsd.us",
            manager:"henderhanc@wgsd.us"}
  var es = {sub:"es.sub@wgsd.us",
            manager:"porlask@wgsd.us"}
  ChangePassword(hs.sub, hs.manager)
  ChangePassword(ms.sub, ms.manager)
  ChangePassword(es.sub, es.manager)
}
function ChangePassword(sub, manager) {
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
//define random password will generate an 8 digit random password [a-z],[0-9]
  var changeTo = {password:getRandomInt(78364164095,2821109907456).toString(36)}
//today's date
  var now = new Date()
  now = (now.getMonth()+1) + "/" + now.getDate() + "/" + now.getYear()
//mail variables  
  var _subject = "New password for " + sub + " for the week of " + now
  var _body = "The password for " + sub + " has been changed.  The password for the week of " + now + " is " + changeTo.password
//take action, change the password

  changeTo = AdminDirectory.Users.update(changeTo, sub)
  
//send email to manager(s)  
  Logger.log(_body);
  MailApp.sendEmail(manager, _subject, _body)
}

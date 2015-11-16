function getUsers(OU) {
  var DOMAIN = Session.getEffectiveUser().getEmail().split("@")[1]
  OU = new RegExp(OU)
  var pages, pageToken, users = new Array(), user
  
  do{
    pages = AdminDirectory.Users.list({
      domain:DOMAIN,
      orderBy: "familyName",
      maxResults: 100,
      pageToken: pageToken})
    //Define which users to use
    for (var i in pages.users)
      if (OU.test(pages.users[i].orgUnitPath)){
        users.push(pages.users[i])}
    pageToken = pages.nextPageToken
  }
  while(pageToken){}
  //Do stuff with Users
  return users
}

function suspendOU(){
  var a = ["Outgoing Staff"], OUs  // Comma Separated Strings of the Unique OU Names you wish to Suspend the users within
  for (OUs in a){
    var users = getUsers(a[OUs])
    for (var i in users){
      var userKey = users[i].primaryEmail
      var resource = {suspended : true}
      AdminDirectory.Users.update(resource, userKey)
      Logger.log("%s was suspended",userKey)
    }
  }
}

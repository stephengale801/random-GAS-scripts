var DOMAIN = Session.getEffectiveUser().getEmail().split("@")[1]

function getOUs(match){
  match = new RegExp("Students")
  var pageToken, users = new Array()
  do{
    var allUsers = AdminDirectory.Users.list({
      domain: DOMAIN,
      maxResults: 100,
      orderBy: 'familyName',
      pageToken: pageToken})
    
    for (var i in allUsers.users){
      if (match.test(allUsers.users[i].orgUnitPath)){
        users.push(allUsers.users[i])
      }
    }
    pageToken = allUsers.pageToken
  }while(pageToken){}
      // Do Stuff with Users
    for (var i in users){
      var user = users[i].primaryEmail
      //get all of users aliaes
      var aliases = AdminDirectory.Users.Aliases.list(user).aliases
      for (var j in aliases){
        var alias = aliases[j].alias
       //remove aliases
        AdminDirectory.Users.Aliases.remove(user, alias)
        Logger.log("Removed Alias %s from %s", alias, user)
      }
    }
}

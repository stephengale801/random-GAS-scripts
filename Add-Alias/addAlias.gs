  function test(){
    var email = {primary:"gales@wgsd.us",
                 alias:"steven.gale@wgsd.us"};
    AddAlias(email.primary, email.alias)
  }
  
function AddAlias(user, alt){
  alt = {alias:alt}
  var aliases = AdminDirectory.Users.Aliases.list(user)
  var numAliases = AdminDirectory.Users.Aliases.list(user).aliases.length
  //check if alias exists
  var re = new RegExp(alt,"g")
  if (re.test(aliases)){
    Logger.log("Alias %s exists, skipping",alt)}
  else{
  var x = AdminDirectory.Users.get(user).aliases.length
  AdminDirectory.Users.Aliases.insert(alt, user)
  }
}

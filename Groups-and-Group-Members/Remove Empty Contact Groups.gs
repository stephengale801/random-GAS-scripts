function getContactGroups(){
  var groups = ContactsApp.getContactGroups()
  for (i in  groups){
    var group = groups[i]
    var numGroupContacts = group.getContacts().length 
    if (numGroupContacts == 0){
      Logger.log(group.getName())
      try{group.deleteGroup()
         }
      catch(err){}
    }
  }
}

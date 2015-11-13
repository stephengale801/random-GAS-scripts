function removeSites() {
  var domain = Session.getEffectiveUser().getEmail().split("@")[1]
  var allSites = SitesApp.getAllSites(domain)
  
  for (i in allSites){
    var page
    var owners = allSites[i].getOwners()
    var site = allSites[i]
    try{ // if User is suspended 
      if (AdminDirectory.Users.get(owners[0].getEmail()).suspended) {
        page = site.getAllDescendants()
        for (i in page){
          Logger.log(page[i].getName() +" Deleted")
          //page[i].deletePage()
        }
        //Change site ownership
        site.removeOwner(owner)
        Logger.log("Removed %s as Owner", owners)
        site.addOwner(Session.getActiveUser())
      }
    }
    catch(err){ // if User is deleted
      page = site.getAllDescendants()
      for (i in page){
        Logger.log(page[i].getName() +" Deleted")
        page[i].deletePage()
        //Change site ownership
        site.removeOwner(owners)
        Logger.log("Removed %s as Owner", owners)
//        site.addOwner(Session.getActiveUser())
      }
    }
  }
} 

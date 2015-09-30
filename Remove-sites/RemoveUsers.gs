function removeViewer() {
  var allSites, site, domain = "YOURDOMAIN", viewers, editors, owners, user = new RegExp("SomeUser"), status = new Array()
  var removeEditor = false
  var removeOwner = false
  var removeViewer = false
  var exceptions = new RegExp("SomeWebsiteName")
  
  allSites = SitesApp.getAllSites(domain)
  for (i in allSites){
    site = allSites[i];
    viewers = site.getViewers()
    editors = site.getEditors()
    owners = site.getOwners()
    
    if (exceptions.test(site.getName())){
        Logger.log("Skipping Site %s",site.getUrl())
        continue;}
    if (removeViewer){
      if (user.test(viewers)){
        for (j in viewers){
          if (user.test(viewers[j])){
            site.removeViewer(viewers[j])
          }}
        status.push("Viewer "+ site.getName()+ " " + site.getUrl())
        Logger.log("Viewer - %s (%s)",site.getName(), site.getUrl())
      }}
    if (removeEditor){
      if (user.test(editors)){
        for (j in editors){
          if (user.test(editors[j])){
            site.removeViewer(editors[j])
          }}
        status.push("Owner "+ site.getName()+ " " + site.getUrl())
        Logger.log("Editor - %s (%s)",site.getName(), site.getUrl())
      }}
    if (removeOwner){
      if (user.test(owners)){
        for (j in owners){
          if (user.test(owners[j])){
            site.removeViewer(owners[j])
          }}
        status.push("Owner "+ site.getName()+ " " + site.getUrl())
        Logger.log("Owner - %s (%s)",site.getName(), site.getUrl())
      }}
  }
}



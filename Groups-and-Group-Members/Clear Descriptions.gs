var domain = Session.getEffectiveUser().getEmail().split("@")[1]

//start functions
function getClearGroupDescriptions(){
  var pageToken, page;
  
  do{
    page = AdminDirectory.Groups.list({
      domain: domain,
      maxResults: 100,
      pageToken: pageToken
    });
    var groups = page.groups;
    if (groups) {
      for (var i = 0; i < groups.length; i++) {
        var group = groups[i]
        var re = new RegExp("Classroom")
        if (!re.test(group)){
          Logger.log(group.name)
        try{                           
          var newDescription = {description: ''}
          group.description = newDescription
          Logger.log(group.description)
        }
        catch(err){                     
          Logger.log(err)}              
      }}
    }
    else{
      Logger.log('No Groups Found')
    }} while (pageToken)
}

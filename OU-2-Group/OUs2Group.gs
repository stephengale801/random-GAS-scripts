function OUs2Groups() {
  var OUs = [], Groups = {group:[],groupMembers:[]};
  var DOMAIN = Session.getEffectiveUser().getEmail().split("@")[1], customerId = 'my_customer', page, pageToken
  var query = "orgUnitPath='/Student'"
  
  do{
    page = AdminDirectory.Users.list({
      domain:DOMAIN,
      query: query,
      type: 'all',
      maxResults: 100,
      pageToken: pageToken
    });
    for (i in page.users){
      var user = page.users[i].primaryEmail;
      var userOrg = page.users[i].orgUnitPath;
      var regexp = new RegExp(userOrg);
      Groups.group[i] = userOrg.replace(/\/.*\//,'');
      Groups.groupMembers[i] = user;
      if (regexp.test(OUs)){
        continue;}
      else{
        OUs.push(userOrg);
      };
    };
    pageToken = page.nextPageToken
  }
  while(pageToken);
  var allGroups, currentGroups = [];
  do{
  allGroups = AdminDirectory.Groups.list({
    domain:DOMAIN,
    maxResults:200,
    pageToken:pageToken
  });
    for (i in allGroups.groups){
     currentGroups.push(allGroups.groups[i].name) 
    }
  pageToken = allGroups.nextPageToken
  }while(pageToken);
  
  for (i in OUs){ //OCD Extract OU Name.
   OUs[i] = OUs[i].replace(/\/.*\//,'')
   
   regexp = new RegExp(OUs[i])
   if (regexp.test(currentGroups)){
     continue;
   }
    else{
      var email = (OUs[i]+"@"+DOMAIN).replace(' ','',"g")
      var resource = {email:email,
                      name:OUs[i]}
      AdminDirectory.Groups.insert(resource)
      currentGroups.push(resource.name)
    }
  }
  try{
    for (i in Groups.groupMembers){
      resource = {email:Groups.groupMembers[i],
                  role: "MEMBER"}
      var groupKey = (Groups.group[i]+"@"+DOMAIN).replace(' ','',"g")
      Logger.log("Adding %s to group %s",resource.email, groupKey)
//      AdminDirectory.Members.insert(resource, groupKey)
    }
  }
  catch(err){Logger.log(err)}
}

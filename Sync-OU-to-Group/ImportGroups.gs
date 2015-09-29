function getAllGroupUsers(){
  var domain = 'YOURDOMAIN'
  var ss = SpreadsheetApp.openById("SPREADSHEET_ID")
  
  var pageToken, page;
  var sheet = ss.getSheets()[1]
  
  sheet.clear()
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
        try{
          var col =  sheet.getLastColumn()+1
          sheet.getRange(1, col).setValue(group.name)
          var groupUsers = AdminDirectory.Members.list(group.email).members
          for (var j = 0 ;  j < groupUsers.length ; j++ ){
            var user = groupUsers[j].getEmail()
            sheet.getRange(j+2, col).setValue(user);
          }
          sheet.autoResizeColumn(col)
        }        
        catch(err){
          Utilities.sleep(1000)
          Logger.log(err.message)
        }
      }
      sheet.getRange("A1:1").setFontWeight("900")
      var  columns = sheet.getLastColumn();
      for (var n = 1; n < columns ; n++){
        sheet.autoResizeColumn(n)
      }
    }
    else{
      Logger.log('No Groups Found')
    }
    pageToken = page.nextPageToken
  } while (pageToken){}
}


function syncGroup(a,b){
  var ss = SpreadsheetApp.openById("SPREADSHEET_ID")
  a = ["Class of 2022"]
  var numRows = ss.getSheets()[0].getMaxRows()
  var numColumns = ss.getSheets()[0].getMaxColumns()
  var domain = 'YOURDOMAIN'
  var page, pageToken
  var groups =  new Array(), newMembers = new Array();
//get all Groups  
  do{
    page = AdminDirectory.Groups.list({
      domain: domain,
      maxResults: 100,
      pageToken: pageToken
    });
    for (var i in page.groups){
      groups.push(page.groups[i])
    }
    pageToken = page.nextPageToken
  }while(pageToken){}
//remove all users from Target Group  
  for (var i in a){
    for (var j in groups){
      if (groups[j].name == a[i]){
        var groupMembers = AdminDirectory.Members.list(groups[j].id).members
        for (var k in groupMembers){
          try{
            AdminDirectory.Members.remove(groups[j].email, groupMembers[k].email)
//          Logger.log("%s removed from %s",groupMembers[k].email,groups[j].email)
          }
          catch(err){Logger.log(err.message)}
        }
//Repopulate Groups with new Members
        newMembers = getNewUsers(a[i])
        var l = 1 // skip the first line
        do {
          var userEmail = newMembers[l]
          var resource = {email: userEmail,
                          role: 'MEMBER'}
          try{
            AdminDirectory.Members.insert(resource,groups[j].email)
            Logger.log("%s added to group %s",userEmail,groups[j].email)
          }
          catch(err){Logger.log(err.message)}
          l++;
        }
        while(l < newMembers.length){}
      }
    }
  }
//Update Groups in Spreadsheet
  getAllGroupUsers()
}

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

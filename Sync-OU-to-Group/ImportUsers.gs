function importOUs() {
  var OUs, page, ss, sheet, pageToken, domain
  domain = "YOURDOMAIN"
  ss = SpreadsheetApp.openById("SPREADSHEET_ID")
  sheet = ss.getSheets()[0]
  sheet.clear()
  do{
    page = AdminDirectory.Orgunits.list("my_customer",{
      domain: domain,
      type: 'all',
      maxResults: 100,
      pageToken: pageToken
    });
    OUs = page.organizationUnits
    
    for (var i in OUs){
      OUs[i].orgId
      var column
      column = sheet.getLastColumn()+1
      sheet.getRange(1,column).setValue(OUs[i].name)
      sheet.getRange(2,column).setValue(OUs[i].orgUnitPath)
      sheet.getRange(3,column).setValue(OUs[i].orgUnitId)
      sheet.autoResizeColumn(column)
    }
    pageToken = page.nextPageToken;
  }while(pageToken){}
}

function WhereMyUsersAt(){
  var users, page, ss, sheet, pageToken, lastCol, domain
  domain = "YOURDOMAIN"
  ss = SpreadsheetApp.openById("SPREADSHEET_ID")
  sheet = ss.getSheets()[0]
  lastCol = sheet.getLastColumn()

  do{
    page = AdminDirectory.Users.list(
      {domain: domain,
       maxResults: 100,
       orderBy: "familyName",
       pageToken: pageToken
      }) 
    users = page.users
    for (var i in users){
      var column, lastRow, userOrg, j 
      column = 1
      lastRow = 1
      userOrg = users[i].orgUnitPath
      for (column ; column < lastCol; column++){
        var orgPath = sheet.getRange(2, column).getValue()
        if (userOrg === orgPath){
          do{lastRow++}
          while(sheet.getRange(lastRow,column).getValue() != ''){}
          sheet.getRange(lastRow, column).setValue(users[i].primaryEmail)
          break;   
        }
      }
    }
    pageToken = page.nextPageToken
  }while(pageToken){}
}

function WhereMyChromiesAt(){
  var chromies, page, ss, sheet, pageToken, lastCol, domain
  domain = "YOURDOMAIN"
  ss = SpreadsheetApp.openById("SPREADSHEET_ID")
  sheet = ss.getSheets()[0]
  lastCol = sheet.getLastColumn()
  
  do{
    page = AdminDirectory.Chromeosdevices.list("my_customer",
      {domain: domain,
       maxResults: 100,
       pageToken: pageToken
      }) 
    chromies = page.chromeosdevices
    for (var i in chromies){
      var column, lastRow, chromieOrg, j 
      column = 1
      lastRow = 1
      chromieOrg = chromies[i].orgUnitPath
      for (column ; column < lastCol; column++){
        var orgPath = sheet.getRange(2, column).getValue()
        if (chromieOrg === orgPath){
          do{lastRow++}
          while(sheet.getRange(lastRow,column).getValue() != ''){}
          sheet.getRange(lastRow, column).setValue(chromies[i].macAddress)
          break;   
        }
      }
    }
    pageToken = page.nextPageToken
  }while(pageToken){}
}

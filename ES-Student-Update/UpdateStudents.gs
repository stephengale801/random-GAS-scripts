function updateStudents() {
  var DOMAIN = Session.getEffectiveUser().getEmail().split("@")[1] 
  var OU = '1.0 ES Student' //String value of OU you want to update
  var ss = SpreadsheetApp.openById("SPREADSHEET_ID")
  var sheet = ss.getSheetByName(OU.replace(" Student","")) //OCD Cleanup... My sheet was named '1.0 ES'
  var userList = []
  listAllStudents(OU)
  
  for (i in userList){
    var user = userList[i];
    var userName = user.getName().getFullName()
    var userGrade = user.getOrgUnitPath().slice(user.orgUnitPath.lastIndexOf(OU),user.orgUnitPath.lastIndexOf("/Class")) //BASED ON MY OU STRUCTURE
    userGrade = userGrade.slice(userGrade.lastIndexOf("/")+1)  // BASED ON MY OU STRUCTURE
    var userPassword = "WGSD_"   //SCHEMA of new Password 
    userPassword += user.orgUnitPath.slice(user.orgUnitPath.lastIndexOf("Class")+9) //SCHEMA for Password
    var username = user.primaryEmail
    //update student password to match userPassword
    var changeTo = {password: userPassword,
                    suspended: false,
                    changePasswordAtNextLogin:false}
    
    changeTo = AdminDirectory.Users.update(changeTo,user.primaryEmail)
    //  sheet.appendRow(["Name: ",userName])
    sheet.appendRow(["Email: ",username])
    sheet.appendRow(["Grade: ",userGrade])
    sheet.appendRow(["Password: ",userPassword])
    sheet.appendRow([" "])
  }
  
  //put list into 4 columns
  var lastRow = sheet.getLastRow()
  var row = parseInt((sheet.getLastRow())/4)
  var column = 1 //sheet.getLastColumn()
  var cell = sheet.getRange((row),column)
  
  var cellValue = cell.getValue()
  do{
    row++;
    cell = sheet.getRange(row,column)
    cellValue = cell.getValue()
  }while(cellValue != " ")
    
    var numRows = row
    //second set
    for (i = 1; i < 5; i++){
      row = numRows*i
      var range = sheet.getRange(row+1, column, numRows, 2)
      var copyToColumn = (3*i+1)
      var copyTo = sheet.getRange(1, copyToColumn, numRows, 2)
      range.moveTo(copyTo)
    }
  //reformat cells spacing
  
  var i = 1
  do{
    Logger.log(i)
    sheet.autoResizeColumn(3*i-2)
    Logger.log("Column %s autoresized",3*i-2)
    sheet.autoResizeColumn(3*i-1)
    //    Logger.log("Column %s autoresized",3*i-1)
    sheet.setColumnWidth((3*i), 25)
    //    Logger.log("Column %s set to 50",3*i)
    i++  
  } while (i<4)
    
    //export as a PDF
    var ssId = ss.getId()
    var pdf = DriveApp.getFileById(ssId).getAs('application/pdf').setName("Copy of Students.pdf")
    var newFile = DriveApp.createFile(pdf).getUrl()
    Logger.log("You can access your file at %s",newFile)
    
    /*****Referenced in Line 6 to populate userList*****/
    function listAllStudents(OU) {
      var re = new RegExp(OU)
      var pageToken, page, now
      now = new Date();
      do {
        page = AdminDirectory.Users.list({
          domain: DOMAIN,
          orderBy: 'familyName',
          maxResults: 100,
          pageToken: pageToken
        });
        var users = page.users;
        if (users) {
          for (var i = 0; i < users.length; i++) {
            var user = users[i];
            if (re.test(user.orgUnitPath)){
              userList.push(user)
            }
          }
        } else {
          Logger.log('No users found.');
        }
        pageToken = page.nextPageToken;
      } while (pageToken);
    }
  /*****End listAllStudents()*****/
}

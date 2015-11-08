//"Zebra zebra short and stout find your head and pull it out" - Hockey croud chant directed at the officials, especially when the croud disagrees with a call.
/*variables*/
try{
  var form = FormApp.openById("FORM_ID")
  .setCollectEmail(true)
  .setProgressBar(false)
  .setRequireLogin(true)
//  .setDestination(FormApp.DestinationType.SPREADSHEET, "SPREADSHEET_ID")
  var ss = SpreadsheetApp.openById(form.getDestinationId())
  var domain = 'YOUR_DOMAIN'  //define from UI or some other manner

  ss.setActiveSheet(ss.getSheets()[(ss.getSheets().length)-1])
  while (ss.getSheets().length < 6){ss.insertSheet()}
  
  var staffSheet = ss.getSheets()[1].setName("Staff");
  var studentsSheet = ss.getSheets()[2].setName("Students");
  var PenaltyOUSheet = ss.getSheets()[3].setName("Penalty Box");
  var currentBoxUsersSheet = ss.getSheets()[4].setName("Current Offenders");
  var auditLogSheet = ss.getSheets()[5].setName("Audit Log")
  //setting headers and formats
  PenaltyOUSheet.getRange("A1:F1").setValues([["Root PenaltyBox OU ID","User OUs","User OU Name", "User OU ID","PenaltyBoxOU","PenaltyBox ID for OU"]]).setBackground("Gray")
  PenaltyOUSheet.getRange("G1:G").setFontColor("White")
  staffSheet.getRange("A1:E1").setValues([["Staff","OUs","Scope","Building Description","RegExp(OU)"]]).setBackground("Gray")
  studentsSheet.getRange("A1:D1").setValues([["Students","OUs","Penalty Box","End Penalty Time"]]).setBackground("Gray")
  auditLogSheet.getRange("A1:G1").setBackground("Gray")

} catch(err){updateAuditLog([new Date,Session.getEffectiveUser(),"Error starting script:",err])}

function updateStaff() {
  var limit = "staff", exclude = ''
  var excludeList = ["Generic","Suspended","Outgoing"]  //import from UI, Store in Sheet
  for (i in excludeList){
    exclude += excludeList[i] + "|"
  }
  exclude = exclude.substring(0,exclude.length-1)
  var sheet, staff = new Array(),limitUsers = new RegExp(limit,"i"),excludeUsers = new RegExp(exclude,"i"), page, pageToken, user
  sheet = staffSheet
  var range = sheet.getRange("A2:B")
  try{
  range.clear()
  }
  catch(err){updateAuditLog([new Date(),"Error clearing Staff sheet",err])}
  do{
    page = AdminDirectory.Users.list({
      maxResults:100,
      domain:domain,
      sortBy:"familyName",
      pageToken:pageToken
    })
    for (i in page.users){
      user = page.users[i]
      if (limitUsers.test(user.orgUnitPath)){
        if (excludeUsers.test(user.orgUnitPath)){
          continue
        }
        staff.push(user)
      }}
    pageToken = page.nextPageToken
  }while(pageToken){}
  for (i in staff){
    sheet.appendRow([staff[i].primaryEmail,staff[i].orgUnitPath])
  }
  sheet.getRange("A2:B").sort(2)
  //update Scope, Buildings and RegExp(OU)
  var buildingsRange = staffSheet.getRange("D2:D").setValues(PenaltyOUSheet.getRange("C2:C").getValues())
  var regexRange = staffSheet.getRange("E2:E")
  
  
//  importOptionsToForm()
}
function updateStudents(){
  var limit = "Student|Penalty", exclude = ''
  var excludeList = ["Generic","Suspended","Outgoing","Graduated"]  //import from UI, Store in Sheet
  for (i in excludeList){
    exclude += excludeList[i] + "|"
  }
  exclude = exclude.substring(0,exclude.length-1)
  
  var sheet, students = new Array(),limitUsers = new RegExp(limit,"i"),excludeUsers = new RegExp(exclude,"i"), page, pageToken, user
  sheet = studentsSheet
  var range = sheet.getRange("A2:D")
  //need to find a more elegant way to update... for now, clear() and repopulate
  try{
  range.clear()
  }
  catch(err){updateAuditLog([new Date(),"Error clearing Student sheet",err])}
  do{
    page = AdminDirectory.Users.list({
      maxResults:100,
      domain:domain,
      sortBy:"familyName",
      pageToken:pageToken
    })
    for (i in page.users){
      user = page.users[i]
      if (limitUsers.test(user.orgUnitPath,i)){
        if (excludeUsers.test(user.orgUnitPath,i)){
          continue
        }
        students.push(user)
      }}
    pageToken = page.nextPageToken
  }while(pageToken){}
  //repopulate
  for (i in students){
    sheet.appendRow([students[i].primaryEmail,students[i].orgUnitPath,/Penalty/i.test(students[i].orgUnitPath)])
  }
  //and sort by OU
  sheet.getRange("A2:D").sort(2)
  
  //check to see if Student OUs have Updated
  currentBoxUsersSheet.getRange("A1").setValue('=QUERY(Students!A:D,"select A,B,C,D where C = true")')
  var LastRow = PenaltyOUSheet.getLastRow()
  var setNewValues = PenaltyOUSheet.getRange("G2").setValue('=Unique(FILTER(Students!B2:B,not(ARRAYFORMULA(REGEXMATCH(Students!B2:B, "Penalty")))))').getValues()
  var originalValues = PenaltyOUSheet.getRange("B2:B"+LastRow)
  var newValues = PenaltyOUSheet.getRange("G2:G"+LastRow)
  if (originalValues.getValues().join() != newValues.getValues().join()){
    newValues.copyValuesToRange(PenaltyOUSheet, 2, 2, 2, LastRow)
    //Need to make sure that PenaltyBoxes still line up!
  }
}

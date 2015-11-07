//"Zebra zebra short and stout find your head and pull it out" - Hockey croud chant directed at the officials, especially when the croud disagrees with a call.
/*variables*/
try{
  var form = FormApp.openById("FORM_ID") //Should be pulled from Addon interface when finished
  .setCollectEmail(true)
  .setProgressBar(false)
  .setRequireLogin(true)
  var ss = SpreadsheetApp.openById(form.getDestinationId())
  var domain = 'YOURDOMAIN'  //define from UI... need to fix
  
  while (ss.getSheets().length < 5){ss.insertSheet()} 
  var staffSheet = ss.getSheets()[1].setName("Staff")
  var studentsSheet = ss.getSheets()[2].setName("Students")
  var PenaltyOUSheet = ss.getSheets()[3].setName("Penalty Box")
  var currentBoxUsersSheet = ss.getSheets()[4].setName("Current Offenders")
  var auditLogSheet = ss.getSheets()[5].setName("Audit Log")

  PenaltyOUSheet.getRange("A1:E1").setValues([["Root PenaltyBoxOU ID","User OUs","User OU Name", "User OU ID","PenaltyBox for OU"]])
  PenaltyOUSheet.getRange("B2").setValue("=UNIQUE(Students!B2:B)")

  } catch(err){}

function updateStaff() {
  var limit = "staff", exclude = ''
  var excludeList = ["Generic","Suspended","Outgoing"]  //import from UI, Store in Sheet
  for (i in excludeList){
    exclude += excludeList[i] + "|"
  }
  exclude = exclude.substring(0,exclude.length-1)
  var sheet, staff = new Array(),limitUsers = new RegExp(limit,"i"),excludeUsers = new RegExp(exclude,"i"), page, pageToken, user
  sheet = staffSheet
  sheet.clear().appendRow(["Staff","OUs","Scope","Building Description","Regex(OU)"])
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
}
function updateStudents(){
  var limit = "Student", exclude = ''
  var excludeList = ["Generic","Suspended","Outgoing","Graduated"]  //import from UI, Store in Sheet
  for (i in excludeList){
    exclude += excludeList[i] + "|"
  }
  exclude = exclude.substring(0,exclude.length-1)
  
  var sheet, students = new Array(),limitUsers = new RegExp(limit,"i"),excludeUsers = new RegExp(exclude,"i"), page, pageToken, user
  sheet = studentsSheet
  //need to find a more elegant way to update... for now, clear() and repopulate
  sheet.clear().appendRow(["Students","OUs","Penalty Box","End Penalty Time"])
  
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
}

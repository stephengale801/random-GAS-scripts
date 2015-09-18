/*  The object of this project is to easily assign the ability to move an OU containing Users or Computers or both from one parent OU to another.  The idea being that the "targetOU" acts as a container, having all settings inherrited.  When the Target is placed into a "newParentOU", it receives all the settings of it's new Parent.

Authorized Session Users (Session.getActiveUser()) are stored in a Spreadsheet, along with the scope which they are allowed to change to/from (separate columns, 3 total)

An Audit of executions is stored in the same Spreadsheet under the tab "DeltaOU Audit".  The Audit includes Session User, TimeStamp targetOU, Original Parent OU, newParentOU, and Success/Fail/Retry status.
*/
// West Grand's OU Structure
/*****LABS**********Parent OUs*******TESTS*******                                      
* Distance Lab   *  K8/Students *  NWEA Testing *
* Trips Lounge   *  HS/Students *  Pearson      *
* North Lab      *  MS/Students *  STAR         *
* South Lab      *  ES/Students *               *
* Career Center  *              *               *
************************************************/

function MoveOU(target, newParent){
  Logger.log(target, newParent)
  var DeltaOU = GettingStarted(target,newParent)
  
  if (DeltaOU.State != "Fail"){ //test to see if User Authorized
    try{
      var resource = {
        parentOrgUnitPath : DeltaOU.NewParentOU[0].getOrgUnitPath()
      }
      var orgUnitPath = DeltaOU.TargetOU[0].orgUnitId
      var customerId = DeltaOU.CustomerId
      var changeTo = AdminDirectory.Orgunits.update(resource, customerId, [orgUnitPath]) //changes parentOrgUnitPath to NewParent
      DeltaOU.State = "Success"
      var aftermath = GettingStarted(target,newParent)
      Logger.log(aftermath.TargetOU[0].parentOrgUnitPath)
    }
    catch(err){
      Logger.log(DeltaOU.State)
    }
  }
  editAuditLog(DeltaOU) //write attempt to Audit Log
}

function GettingStarted(a,b) {
  var ss, userSheet, auditSheet //variables referring to Spreadsheet
  var searchTargetOU, searchNewParentOU,userScope //variables referring to Search Terms for OUs
  var allOUs, targetOU, parentOU, newParentOU //variables referring to OU Objects/Arrays
  var user, timeStamp, state, page, pageToken //Other variables
  
  var domain = 'wgsd.us'                                         //temporary hard coded
  var SSID = "1rNkaYF7fyEos9OdIR4YyjM5JZmvkN6q2u1nwE12wkEc"      //temporary hard coded
  var customerId = 'my_customer'
  
  ss = SpreadsheetApp.openById(SSID)
  userSheet = ss.getSheets()[0].setName("Authorized Users")
  auditSheet = ss.getSheetByName("DeltaOU Audit")
  if(auditSheet == null){
    auditSheet = ss.insertSheet().setName("DeltaOU Audit")
  }
  
  var scope = getUserScope(userSheet)  
  if ((typeof scope) == "object"){ //test to see if User is Authorized.
    
    allOUs = new Array
    targetOU = new Array
    parentOU = new Array
    newParentOU = new Array
    
    searchTargetOU = new RegExp(a+"$")
    searchNewParentOU = new RegExp(b+"$")
    userScope = scope.scopeA
    user = Session.getActiveUser()
    timeStamp = new Date()
    
    //list OUs - push to OU arrays within userScope
    do{
      page = AdminDirectory.Orgunits.list(customerId,{
        domain: domain,
        type: 'all',
        maxResults: 100,
        pageToken: pageToken
      });
      for (i=0 ; i < page.organizationUnits.length; i++ ){
        if (userScope.test(page.organizationUnits[i].parentOrgUnitPath)){
          allOUs.push(page.organizationUnits[i])
          
          if (searchNewParentOU.test(page.organizationUnits[i].orgUnitPath)){
            newParentOU.push(page.organizationUnits[i])};
          if (searchTargetOU.test(page.organizationUnits[i].orgUnitPath)){
            targetOU.push(page.organizationUnits[i]);
            parentOU.push(AdminDirectory.Orgunits.get(customerId, [page.organizationUnits[i].parentOrgUnitId]))};
        }
      }
      pageToken = page.nextPageToken;
    }
    while(pageToken) //end push to OU arrays
      
      state = ""
      //store values in JSON object
      var  DeltaOU = { Spreadsheet: ss,
                      UserSheet: userSheet,
                      AuditSheet: auditSheet,
                      AllOUs: allOUs,
                      TargetOU: targetOU,
                      ParentOU: parentOU,
                      NewParentOU: newParentOU,
                      User: user,
                      TimeStamp: timeStamp,
                      State: state,
                      CustomerId: customerId}
      Logger.log(DeltaOU.NewParentOU)
      if (DeltaOU.NewParentOU[0].orgUnitId == DeltaOU.ParentOU[0].orgUnitId){
        DeltaOU.State = "Fail"
        Logger.log("Already Moved")
      }
  }
  else { //if user is not Authorized
    DeltaOU = {User: Session.getActiveUser(),
               AuditSheet: auditSheet,
               TimeStamp: new Date(),
               TargetOU: [{orgUnitPath:"Unauthorized User"}],
               ParentOU: [{orgUnitPath:"Unauthorized User"}],
               NewParentOU: [{orgUnitPath:"Unauthorized User"}],
               State: "Fail"}
  }
  return DeltaOU
}

function getUserScope(userSheet){
  var sessionUser = Session.getActiveUser()
  var userRange = userSheet.getRange("A2:C").getValues()
  var scope
  for (i in userRange){
    var user = userRange[i][0]  //Column A
    var scopeA = userRange[i][1]  //Column B
    var scopeB = userRange[i][2]  //Column C
    if (user == sessionUser){
      scope = {user: new RegExp(user),
               scopeA: new RegExp(scopeA),
               scopeB: new RegExp(scopeB)}
      Logger.log(scope)
      return scope
    }
    else{
      scope = "User Not Authorized";
      continue
    }
    return scope
  }
}
function deviceOUs(){
 AdminDirectory.Chromeosdevices.list(customerId, optionalArgs).chromeosdevices[1] 
}
function editAuditLog(DeltaOU){
  try{
    var sheet = DeltaOU.AuditSheet
    var user = DeltaOU.User
    var timeStamp = DeltaOU.TimeStamp
    var targetOU = DeltaOU.TargetOU[0].orgUnitPath
    var originalOU = DeltaOU.ParentOU[0].orgUnitPath
    var newOU = DeltaOU.NewParentOU[0].orgUnitPath
    var state = DeltaOU.State}
  catch(err){
    Logger.log(err.message)
  }
  if (state == undefined){state = "Fail"}
  sheet.appendRow([user,timeStamp,targetOU,originalOU,newOU,state])
}

function redCard(e){
  //executes on form submit
  try{
    //    Utilities.sleep(1500); 
    Logger.log("%s is (a) %s",e,typeof e)
    if ((e == undefined) || (typeof e == "object")){
      if ((typeof e == "object")){  
        var check = e.response.getEditResponseUrl()};
      var len = (form.getResponses().length-1)
      }
    var $response = getResponses(form,len);
    if ((check != $response.editUrl) && (check != undefined)){
      if(e > 0){
        e--; redCard(e)}
      else {throw("Error: something screwed up")}
    }
    Logger.log("Check passed - referencing the correct response")
  }
  catch(err){Logger.log("Error in phase 1: %s",err);return false}
  
  try{
    //begin checks
    if ($response.email == $response.sessionUser){  //ensure sessionUser is who they say they are.
      var email = $response.email
      var sheet = ss.getSheetByName("Staff")
      var rowLen = sheet.getLastRow()
      var users = sheet.getRange(1,1,rowLen).getValues()
        var userIndex
        for (i in users){
          if(users[i] == email){
            userIndex = i // 0 indexed
            userIndex++ //For some reason + was not being treated as add, rather concatenate, even when userIndex was defined as a new Number()
            break
          }
        }
      var scope = sheet.getRange(userIndex, 3).getValue()
      var authorize = getScope(scope)
      for (i in $response.redCard){  
       var re = new RegExp($response.redCard[i])
       if(re.test(authorize)){  //ensure sessionUser has is authorized for those students
                       //Student     // session user  //duration
           moveUser($response.redCard[i], email, $response.duration)
       }
        else{throw($response.sessionUser+" is not authorized to RedCard selected users: "+ $response.redCard); return}
      }
    }
    else{throw($response.sessionUser+" entered incorrect email address")}
  }
  catch(err){Logger.log("Error in phase 2: %s",err)
            return false}
  
  
  function moveUser(student, user, duration){
    var sheet = studentsSheet
    var numRows = sheet.getLastRow()
    var students = sheet.getRange(1,1,numRows).getValues()
    var studentIndex 
    for (i in students){
      if(students[i] == student){
        studentIndex = i // 0 indexed
        studentIndex++ //For some reason + was not being treated as add, rather concatenate, even when userIndex was defined as a new Number()
          break
      }
    }
    var studentOU = sheet.getRange(studentIndex,2).getValue()
    var PenaltyBoxes = getPenaltyBoxes(AdminDirectory.Orgunits.list("my_customer", {domain: domain,type: 'all'}).organizationUnits)
    
    function getPenaltyBoxes(allOUs){
      var that = new Array()
      var searchFor = "/Penalty Box"
      for (i in allOUs){
        var re = new RegExp(searchFor)
        if (re.test(allOUs[i].orgUnitPath,"i")){
          that.push(allOUs[i])
        }  
      }
      return that
    }
    
    for (i in PenaltyBoxes){
     var re = new RegExp(PenaltyBoxes[i].parentOrgUnitPath)
     if (re.test(studentOU)){
       var PenaltyBox = PenaltyBoxes[i]  
       Logger.log(PenaltyBoxes[i].orgUnitPath)
     }
    }
    var resource = {orgUnitPath: PenaltyBox.orgUnitPath
    }
    try{
//      AdminDirectory.Users.update(resource, student) // Commented out for testing purposes
      Logger.log("%s successfully moved to %s", student, resource.orgUnitPath)
    }
    catch(err){Logger.log("Error moving %s: %s",$response.redCard[i], err)}
  }
  //getResponse function
  function getResponses(f, response_number){
    if (f == undefined){
      var f = form
      }
    if (response_number == undefined){
      response_number = (f.getResponses().length-1) 
    }
    var formResponses = f.getResponses();
    var $responses = new Array;
    for (i = (response_number) ; i < (response_number+1); i++) {
      var formResponse = formResponses[response_number];
      var formResponseEditUrl = formResponse.getEditResponseUrl();
      var itemResponses = formResponse.getItemResponses();
      var sessionUser = formResponse.getRespondentEmail()
      }
    var redCardUsers = new Array()
    for (i in itemResponses){
      switch(true){
        case (itemResponses[i].getItem().getTitle() == "Select your email from the list"):
          var email = itemResponses[i].getResponse()
          break;
        case(itemResponses[i].getItem().getTitle() == "How long shall we keep the user(s) in the Penalty Box?"):
          var duration = itemResponses[i].getResponse()
          break;
        case(itemResponses[i].getItem().getTitle() == "Where are the student(s) located"):
          var building = itemResponses[i].getResponse()
          break;
        default :
          redCardUsers.push(itemResponses[i].getResponse())
          break;
      }
    }
    var that={email:email,
              duration:duration,
              building:building,
              redCard:redCardUsers[0],
              editUrl:formResponseEditUrl,
              sessionUser:sessionUser}
    return that
  }
}

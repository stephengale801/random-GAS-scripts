function redCard(e){
  //executes on form submit
  try{
    //    Utilities.sleep(1500); 
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
    Logger.log("Check passed - referencing the correct response");
  }
  catch(err){updateAuditLog([new Date(),"Error in phase 1:",err]);return false;}
  
  try{
    //begin checks
    if ($response.email == $response.sessionUser){  //ensure sessionUser is who they say they are.
      var email = $response.email, sheet = ss.getSheetByName("Staff"), rowLen = sheet.getLastRow()
      var users = sheet.getRange(1,1,rowLen).getValues(), userIndex
      for (i in users){
        if(users[i] == email){
          userIndex = i; userIndex++;
          break
        }
      }
      var scope = sheet.getRange(userIndex, 3).getValue()
      if (scope === ''){
        throw("Scope for "+$response.sessionUser+" is not set.")}
      var authorize = getScope(scope)
      for (i in $response.redCard){
        var re = new RegExp($response.redCard[i])
        if(re.test(authorize)){
                       //Student     // session user  //duration
          moveUser($response.redCard[i], email, $response.duration)
        }
        else{throw($response.sessionUser+" is not authorized to RedCard selected users: "+ $response.redCard)}
      }
    }
    else{throw($response.sessionUser+" entered incorrect email address")}
  }
  catch(err){updateAuditLog([new Date(),"Error in phase 2:",err]);return false}
  //if moving the student was successful, update the student sheet
  updateStudents()
  
  //internally used functions  
  function moveUser(student, user, duration){
    try{
      var sheet = studentsSheet, numRows = sheet.getLastRow(), students = sheet.getRange(1,1,numRows).getValues(), studentIndex, endTime 
      for (i in students){
        if(students[i] == student){
          studentIndex = i; studentIndex++;
          break
        }
      }
      var studentOU = sheet.getRange(studentIndex,2).getValue()
      var PenaltyBox = PenaltyOUSheet.getRange("C2:C"+PenaltyOUSheet.getLastRow()).getValues()
      var PenaltyBoxIndex
      for (i in PenaltyBox){
        if ($response.building == PenaltyBox[i]){
          PenaltyBoxIndex = (new Number(i) + 2);
          break;
        }
      }
      var PenaltyBoxId = PenaltyOUSheet.getRange("E"+PenaltyBoxIndex).getValue()
      var OrgUnitPath = AdminDirectory.Orgunits.get('my_customer', [PenaltyBoxId])
      var resource = {orgUnitPath: OrgUnitPath.orgUnitPath}
      if (/[0-9]{2}/.test(duration)){
        endTime = "=E"+(auditLogSheet.getLastRow()+1)+"+("+duration.match(/[0-9]{1,2}/)+"*(1/24/60))"
      }
      else if (/[0-9]{1}/.test(duration)){
        endTIme = "=E"+(auditLogSheet.getLastRow()+1)+"+("+duration.match(/[0-9]{1}/)+"*(1/24))"
      }
      else{endTime = 60000}
      AdminDirectory.Users.update(resource, student)
      var LastRow =  new Number(auditLogSheet.getLastRow())+1
      updateAuditLog([student, user, resource.orgUnitPath, duration, $response.timeStamp, endTime,"=IF(NOT(ISBLANK(F"+LastRow+")),(F"+LastRow+"-NOW())<0,F"+LastRow+")"])
      }
      catch(err){updateAuditLog([new Date(),"Error moving",$response.redCard[i], err])}
    }
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
        var sessionUser = formResponse.getRespondentEmail();
        var timeStamp = formResponse.getTimestamp();
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
                timeStamp: timeStamp,
                duration:duration,
                building:building,
                redCard:redCardUsers[0],
                editUrl:formResponseEditUrl,
                sessionUser:sessionUser}
      return that
    }
  }
  function updateAuditLog(payload){
    var sheet = auditLogSheet
    sheet.appendRow(payload)
  }

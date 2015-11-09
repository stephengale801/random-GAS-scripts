function Initialize() {
  //run checks to see what is present - execute next function in sequence;
  var status, staffCell, studentCell, buildingCell, scopeCell, formCreateCell, formPopulateCell, submitCell, timeCell, editCell, formIdCell
  
  formIdCell = PenaltyOUSheet.getRange("A2")
  staffCell = PenaltyOUSheet.getRange("A4")
  studentCell = PenaltyOUSheet.getRange("A6")
  buildingCell = PenaltyOUSheet.getRange("A8")
  scopeCell = PenaltyOUSheet.getRange("A10")
  formCreateCell = PenaltyOUSheet.getRange("A12")
  formPopulateCell = PenaltyOUSheet.getRange("A12")
  submitCell = PenaltyOUSheet.getRange("A16")
  timeCell = PenaltyOUSheet.getRange("A18")
  editCell = PenaltyOUSheet.getRange("A20")
  

  var status = {
    staffImported: staffCell.getValue(),
    studentsImported: studentCell.getValue(),
    buildingsPopulated: buildingCell.getValue(),
    scopesDefined: scopeCell.getValue(),
    formCreated: formCreateCell.getValue(),
    formPopulate: formPopulateCell.getValue(),
    submitTrigger: submitCell.getValue(),
    timeTrigger: timeCell.getValue(),
    onEditTrigger: editCell.getValue()
  }
  switch(true){
    case (status.staffImported == ''):
      Logger.log("Updating Staff")
      updateStaff()
      staffCell.setValue("Staff Imported ✓")
      .setBackground("Green")
      .setHorizontalAlignment("center")
      updateAuditLog([new Date(), Session.getActiveUser(), "Inital installation - Imported Staff: Success"])
      break;
    case (status.studentsImported == ''):
      updateStudents()
      staffCell.setValue("Students Imported ✓")
      .setBackground("Green")
      .setHorizontalAlignment("center")
      updateAuditLog([new Date(), Session.getActiveUser(), "Inital installation - Imported Students: Success"])
      break;
    case (status.buildingsPopulated == ''):
      buildABox()
      staffCell.setValue("Penalty Box Created ✓")
      .setBackground("Green")
      .setHorizontalAlignment("center")
      updateAuditLog([new Date(), Session.getActiveUser(), "Inital installation - Build-a-Box: Success"])
      break;
    case (status.formCreateCell == ''):
      var form = FormApp.create("Zebra")
      .setCollectEmail(true)
      .setProgressBar(false)
      .setRequireLogin(true)
      .setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId())
      formIdCell.setValue(form.getId())
      updateAuditLog([new Date(), Session.getActiveUser(), "Inital installation - Created Zebra Form: Success"])
      
    case (status.formPopulateCell == ''):
      updateForm()
      staffCell.setValue("Zebra Form Created ✓")
      .setBackground("Green")
      .setHorizontalAlignment("center")
      updateAuditLog([new Date(), Session.getActiveUser(), "Inital installation - Updated Zebra Form: Success"])
      break;
    case (status.submitTrigger == ''):
      installOnSubmit()
      staffCell.setValue("Submit Trigger Installed ✓")
      .setBackground("Green")
      .setHorizontalAlignment("center")
      updateAuditLog([new Date(), Session.getActiveUser(), "Inital installation - Installed Submit Trigger: Success"])
      break;
    case (status.timeTrigger == ''):
      installTimeTrigger()
      staffCell.setValue("Time Trigger Installed ✓")
      .setBackground("Green")
      .setHorizontalAlignment("center")
      updateAuditLog([new Date(), Session.getActiveUser(), "Inital installation - Installed Time Trigger: Success"])
      break;
    case (status.onEditTrigger == ''):
      installOnEdit()
      staffCell.setValue("Edit Trigger Installed ✓")
      .setBackground("Green")
      .setHorizontalAlignment("center")
      updateAuditLog([new Date(), Session.getActiveUser(), "Inital installation - Installed Time Trigger: Success"])
      break;
      
  }
}


function installOnEdit(){
  ScriptApp.newTrigger("UpdateForm")
  .forSpreadsheet(ss)
  .onEdit()
  .create()
}
function installOnSubmit(){
  ScriptApp.newTrigger("redCard")
  .forForm(form)
  .onFormSubmit()
  .create()
}
function installTimeTrigger(){
  ScriptApp.newTrigger("checkExpiration")
  .timeBased()
  .everyMinutes(5)
  .create()
}

function checkExpiration(){
  if (currentBoxUsersSheet.getLastRow() > 1){
    var sheet = auditLogSheet
    var LastRow = sheet.getLastRow()
    var range = sheet.getRange("A2:G"+LastRow)
    for (i = 0; i < range.getValues().length; i++){
      var rowIndex = new Number(i)+2
      var isExpired = range.getValues()[i][6]
      var student = range.getValues()[i][0]
      if (!isExpired){continue}
      else {
        //Add Marker to show that the line has been previously processed. (Background Color, etc)
        
        var status = isRedCarded(student)
        if (status != false){
          Logger.log(status.newLocationId)
          var resource = {orgUnitPath: status.newLocation}
          AdminDirectory.Users.update(resource, status.email)
          updateAuditLog([student,"Zebra - Times Up",status.newLocation,"Indefinitely",new Date(),"",
                          "=IF(NOT(ISBLANK(F"+LastRow+1+")),(F"+LastRow+1+"-NOW())<0,F"+LastRow+1+")"])
        }
      }
    }
    updateStudents()
  }
  
  //internal functions
  function isRedCarded(student){
    student = {email : student,
               currentLocation : '',
               currentLocationId : '',
               newLocation : '',
               newLocationId : ''}
    
    var currentOffenders = currentBoxUsersSheet.getRange("A2:C"+currentBoxUsersSheet.getLastRow()).getValues()
    var re = new RegExp(student.email)
    if (re.test(currentOffenders)){
      var j=0
      while(j < currentOffenders.length){
        if (currentOffenders[j][0] == student.email){
          student.currentLocation = currentOffenders[j][1]
          var LastRow = PenaltyOUSheet.getLastRow()
          var matrix = PenaltyOUSheet.getRange("B2:G"+LastRow).getValues()
          for (var k = 0; k < matrix.length; k++){
            if (matrix[k][3] == student.currentLocation){
              student.currentLocationId = matrix[k][4]
              student.newLocation = matrix[k][0]
              student.newLocationId = matrix[k][2]
              return student
            }
          }
        }
        j++;
      }
    }
    return false
  }//end isRedCarded()
}

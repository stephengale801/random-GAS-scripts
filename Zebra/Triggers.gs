function Initialize() {
  //run checks to see what is present - execute next function in sequence;
  var status, staffCell, studentCell, buildingCell, formPopulateCell, submitCell, timeCell, editCell
  
  staffCell = statusSheet.getRange("D2")
  studentCell = statusSheet.getRange("D3")
  buildingCell = statusSheet.getRange("D4")
  formPopulateCell = statusSheet.getRange("D5")
  submitCell = statusSheet.getRange("D6")
  timeCell = statusSheet.getRange("D7")
  editCell = statusSheet.getRange("D8")
  
  var status = {
    staffImported: staffCell.getValue(),
    studentsImported: studentCell.getValue(),
    buildingsPopulated: buildingCell.getValue(),
    formPopulate: formPopulateCell.getValue(),
    submitTrigger: submitCell.getValue(),
    timeTrigger: timeCell.getValue(),
    onEditTrigger: editCell.getValue()
  }
  while (status.timeTrigger == ''){
    switch(true){
      case (status.staffImported == ''): //1
        updateStaff()
        staffCell.setValue("Staff Imported ✓")
        .setBackground("Green")
        .setHorizontalAlignment("center")
        updateAuditLog([new Date(), Session.getActiveUser(), "Inital installation - Imported Staff: Success"])
        status.staffImported = staffCell.getValue()
        break;
      case (status.studentsImported == ''): //2
        updateStudents()
        studentCell.setValue("Students Imported ✓")
        .setBackground("Green")
        .setHorizontalAlignment("center")
        updateAuditLog([new Date(), Session.getActiveUser(), "Inital installation - Imported Students: Success"])
        status.studentsImported = studentCell.getValue()
        break;
      case (status.buildingsPopulated == ''): //3
        var buildingsRange1 = PenaltyOUSheet.getRange("B2")
        .setValue('=Unique(FILTER(Students!B2:B,not(ARRAYFORMULA(REGEXMATCH(Students!B2:B, "Penalty")))))')
        var buildingsRange2 = staffSheet.getRange("D2")
        .setValue('=Unique(FILTER('+"'Penalty Box'!C2:C,not(ARRAYFORMULA(REGEXMATCH('Penalty Box'!C2:C,"+'"Penalty|Error")))))')        
        buildABox()
        buildingCell.setValue("Penalty Box Created ✓")
        .setBackground("Green")
        .setHorizontalAlignment("center")
        updateAuditLog([new Date(), Session.getActiveUser(), "Inital installation - Build-a-Box: Success"])
        status.buildingsPopulated = buildingCell.getValue()
        break;
      case (status.formPopulate == ''): //4
        importOptionsToForm(form)
        formPopulateCell.setValue("Zebra Form Updated ✓")
        .setBackground("Green")
        .setHorizontalAlignment("center")
        updateAuditLog([new Date(), Session.getActiveUser(), "Inital installation - Updated Zebra Form: Success"])
        status.formPopulate = formPopulateCell.getValue()
        break;
      case (status.submitTrigger == ''): //5
        installOnSubmit()
        submitCell.setValue("Submit Trigger Installed ✓")
        .setBackground("Green")
        .setHorizontalAlignment("center")
        updateAuditLog([new Date(), Session.getActiveUser(), "Inital installation - Installed Submit Trigger: Success"])
        status.submitTrigger = submitCell.getValue()
        break;
      case (status.timeTrigger == ''): //6
        installTimeTrigger()
        timeCell.setValue("Time Trigger Installed ✓")
        .setBackground("Green")
        .setHorizontalAlignment("center")
        updateAuditLog([new Date(), Session.getActiveUser(), "Inital installation - Installed Time Trigger: Success"])
        status.timeTrigger = timeCell.getValue()
        break;
//      case (status.onEditTrigger == ''): //7
//        installOnEdit()
//        editCell.setValue("Edit Trigger Installed ✓")
//        .setBackground("Green")
//        .setHorizontalAlignment("center")
//        updateAuditLog([new Date(), Session.getActiveUser(), "Inital installation - Installed Time Trigger: Success"])
//        status.onEditTrigger = editCell.getValue()
//        break;
    }
  }
}
function installOnEdit(){
  ScriptApp.newTrigger("importOptionsToForm")
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

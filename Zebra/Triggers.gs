function Initialize() {
  //Function to Install Addon - Not Yet Built
}
function installOnEdit(){
  ScriptApp.newTrigger("UpdateForm")
  .forSpreadsheet(ss)
  .onChange()
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

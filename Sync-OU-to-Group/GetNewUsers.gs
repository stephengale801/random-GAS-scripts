function getNewUsers(match){
  var newMembers = new Array()
  var groupRow = new Number(3), groupColumn = new Number(0)
  var sheet = SpreadsheetApp.openById("SPREADSHEET_ID").getSheets()[1]
  var range = sheet.getRange(1, 1, sheet.getMaxRows(),sheet.getMaxColumns()).getValues()
  
  //Get the Group Index column From Sheet (b)
  for (var i in range[0]){
    if (range[0][i] == match){
      var groupIndex = i
      for (var j in range){
        if (range[j][groupIndex] != ''){
        newMembers.push(range[j][groupIndex])
        }
      }
    }
  }
  return newMembers
}

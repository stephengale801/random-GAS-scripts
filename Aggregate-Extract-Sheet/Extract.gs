function extract() {
  var ss, sheets, sheet, range
  ss = SpreadsheetApp.getActive()
  sheets = ss.getSheets()
  for (i in sheets){
    var row, col
    sheet = sheets[i];
    row = sheet.getLastRow();
    col = sheet.getLastColumn();
    range = sheet.getRange(1,1,row,col);
    var values = range.getValues();
    var name = sheet.getRange("C3").getValue();
    
    SpreadsheetApp.create(name)
    .getSheets()[0].activate()
    .getRange(1,1,row,col)
    .setValues(values);
  }
}

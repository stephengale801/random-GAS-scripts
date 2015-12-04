function aggregate() {
  var folder, spreadsheets, combinedSheet
  folder = DriveApp.getFoldersByName("Aggregate Spreadsheets");
  combinedSheet = SpreadsheetApp.create("Combined Spreadsheets");
  while(folder.hasNext()){
    spreadsheets = folder.next().getFilesByType(MimeType.GOOGLE_SHEETS);
    while(spreadsheets.hasNext()){
      var ss, sheet, col, row, values, newRow, range
      ss = SpreadsheetApp.open(spreadsheets.next());
      sheet = ss.getSheets()[0];
      col = sheet.getLastColumn();
      row = sheet.getLastRow();
      values = sheet.getRange(1, 1, row, col).getValues();
      newRow = combinedSheet.getSheets()[0].getLastRow()+1;
      Logger.log(newRow)
      Logger.log(row)
      range = combinedSheet.getSheets()[0].getRange(newRow, 1, (row),col);
      range.setValues(values)
    }
  }
}

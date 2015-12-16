function findandreplace() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var row = 1, numRows = sheet.getMaxRows()
  var col = 1 // column index (A=1, B=2, C=3, etc.) of the row to find/replace
  var data = sheet.getRange(row, col, numRows).getValues()
  for (i in data) {
    row = i;
    switch(true){
      case (data[i][0] == "AL"):
        row++;
        sheet.getRange(row,col).setValue("Alabama");
        break;
      case (data[i][0] == "AZ"):
        row++;
        sheet.getRange(row,col).setValue("Arizona");
        break;
      case (data[i][0] == "CA"):
        row++;
        sheet.getRange(row,col).setValue("California");
        break;
      case (data[i][0] == "CO"):
        row++;
        sheet.getRange(row,col).setValue("Colorado");
        break;
      case (data[i][0] == "CT"):
        row++;
        sheet.getRange(row,col).setValue("Connecticut");
        break;
      case (data[i][0] == "DE"):
        row++;
        sheet.getRange(row,col).setValue("Delaware");
        break;
      case (data[i][0] == "FL"):
        row++;
        sheet.getRange(row,col).setValue("Florida");
        break;
      case (data[i][0] == "GA"):
        row++;
        sheet.getRange(row,col).setValue("Georgia");
        break;
      case (data[i][0] == "IA"):
        row++;
        sheet.getRange(row,col).setValue("Iowa");
        break;
      case (data[i][0] == "IL"):
        row++;
        sheet.getRange(row,col).setValue("Illinois");
        break;
      case (data[i][0] == "IN"):
        row++;
        sheet.getRange(row,col).setValue("INdiana");
        break;
      case (data[i][0] == "KS"):
        row++;
        sheet.getRange(row,col).setValue("Kansas");
        break;
      case (data[i][0] == "KY"):
        row++;
        sheet.getRange(row,col).setValue("Kentucky");
        break;
      case (data[i][0] == "LA"):
        row++;
        sheet.getRange(row,col).setValue("Louisiana");
        break;
      case (data[i][0] == "MA"):
        row++;
        sheet.getRange(row,col).setValue("Massachusetts");
        break;
      case (data[i][0] == "MD"):
        row++;
        sheet.getRange(row,col).setValue("Maryland");
        break;
      case (data[i][0] == "ME"):
        row++;
        sheet.getRange(row,col).setValue("Maine");
        break;
      case (data[i][0] == "MI"):
        row++;
        sheet.getRange(row,col).setValue("Michigan");
        break;
      case (data[i][0] == "MN"):
        row++;
        sheet.getRange(row,col).setValue("Minnesota");
        break;        
      case (data[i][0] == "MO"):
        row++;
        sheet.getRange(row,col).setValue("Missouri");
        break;
      case (data[i][0] == "MS"):
        row++;
        sheet.getRange(row,col).setValue("Mississippi");
        break;
      case (data[i][0] == "MT"):
        row++;
        sheet.getRange(row,col).setValue("Montana");
        break;
      case (data[i][0] == "NC"):
        row++;
        sheet.getRange(row,col).setValue("North Carolina");
        break;
      case (data[i][0] == "ND"):
        row++;
        sheet.getRange(row,col).setValue("North Dakota");
        break;
      case (data[i][0] == "NE"):
        row++;
        sheet.getRange(row,col).setValue("Nebraska");
        break;
      case (data[i][0] == "NH"):
        row++;
        sheet.getRange(row,col).setValue("New Hampshire");
        break;
      case (data[i][0] == "NJ"):
        row++;
        sheet.getRange(row,col).setValue("New Jersey");
        break;
      case (data[i][0] == "NM"):
        row++;
        sheet.getRange(row,col).setValue("New Mexico");
        break;
      case (data[i][0] == "NV"):
        row++;
        sheet.getRange(row,col).setValue("Nevada");
        break;
      case (data[i][0] == "NY"):
        row++;
        sheet.getRange(row,col).setValue("New York");
        break;
      case (data[i][0] == "OH"):
        row++;
        sheet.getRange(row,col).setValue("Ohio");
        break;
      case (data[i][0] == "OK"):
        row++;
        sheet.getRange(row,col).setValue("Oklahoma");
        break;
      case (data[i][0] == "OR"):
        row++;
        sheet.getRange(row,col).setValue("Oregon");
        break;
      case (data[i][0] == "PA"):
        row++;
        sheet.getRange(row,col).setValue("Pennsylvania");
        break;
      case (data[i][0] == "RI"):
        row++;
        sheet.getRange(row,col).setValue("Rhode Island");
        break;
      case (data[i][0] == "SC"):
        row++;
        sheet.getRange(row,col).setValue("South Carolina");
        break;
      case (data[i][0] == "SD"):
        row++;
        sheet.getRange(row,col).setValue("South Dakota");
        break;
      case (data[i][0] == "TN"):
        row++;
        sheet.getRange(row,col).setValue("Tennessee");
        break;
      case (data[i][0] == "TX"):
        row++;
        sheet.getRange(row,col).setValue("Texas");
        break;
      case (data[i][0] == "UT"):
        row++;
        sheet.getRange(row,col).setValue("Utah");
        break;
      case (data[i][0] == "VA"):
        row++;
        sheet.getRange(row,col).setValue("Virginia");
        break;
      case (data[i][0] == "VT"):
        row++;
        sheet.getRange(row,col).setValue("Vermont");
        break;
      case (data[i][0] == "WA"):
        row++;
        sheet.getRange(row,col).setValue("Washington");
        break;
      case (data[i][0] == "WI"):
        row++;
        sheet.getRange(row,col).setValue("Wisconsin");
        break;
      case (data[i][0] == "WV"):
        row++;
        sheet.getRange(row,col).setValue("West Virginia");
        break;
      case (data[i][0] == "WY"):
        row++;
        sheet.getRange(row,col).setValue("Wyoming");
        break;
    };
  };
};

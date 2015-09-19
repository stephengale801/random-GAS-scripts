//variables to pass from UI
var domain = 'YOUR_DOMAIN'
var ss = SpreadsheetApp.openById('SPREADSHEET_ID');

//start functions
function getAllGroupUsers(){
  var pageToken, page;
  var sheet = ss.getSheets()[0]
  
  sheet.clear()
  do{
    page = AdminDirectory.Groups.list({
      domain: domain,
      maxResults: 100,
      pageToken: pageToken
    });
    var groups = page.groups;
    if (groups) {
      for (var i = 0; i < groups.length; i++) {
        var group = groups[i]
     /* try{                            //comment out this section if you want to include all groups
          var re = new RegExp("[0-9]")  //and here
          if(re.test(group.name)) {     //and here
            Logger.log("Skipping %s - Student Group",group.name)    //and here
          }                             //and here
          else{                         //and here*/
            try{
              var col =  sheet.getLastColumn()+1
              sheet.getRange(1, col).setValue(group.name+" ("+group.email+")")
              var groupUsers = AdminDirectory.Members.list(group.email).members
              for (var j = 0 ;  j < groupUsers.length ; j++ ){
                var user = groupUsers[j].getEmail()
                sheet.getRange(j+2, col).setValue(user);
              }}        
            catch(err){
              Utilities.sleep(1000)
              Logger.log(err.message)
            }
       /* }}
          catch(err){                     //and here
          Logger.log(err)}              //and here*/
      }
      //formatting sheet (Bold top row, resize columns
      sheet.getRange("A1:1").setFontWeight("900")
      var  columns = sheet.getLastColumn();
      for (var n = 1; n < columns ; n++){
      sheet.autoResizeColumn(n)
      }
    }
    else{
      Logger.log('No Groups Found')
    }} while (pageToken)
}
function installOnSheet(){
  ScriptApp.newTrigger("getAllGroupUsers")
  .forSpreadsheet(ss)
  .onOpen()
  .create();}

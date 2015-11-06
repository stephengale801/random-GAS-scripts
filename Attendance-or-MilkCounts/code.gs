var ss = SpreadsheetApp.openById("CLASS_ROSTER_SPREADSHEET_ID");
var form = FormApp.openById("NEW_GOOGLE_FORM_ID");

function Install1stTrigger(){
  ScriptApp.newTrigger("updateStudents")
  .forSpreadsheet(ss)
  .onEdit()
  .create(); 
}

function CreateForm() {
  var pageBreaks = form.getItems(FormApp.ItemType.PAGE_BREAK)
  var sheets = ss.getSheets()
  var teachers = getTeacherNames()
  
  form.addMultipleChoiceItem();
  //  set choices from first item to name of Sheets Tabs
  try {
    //  Chance name of PAGE_BREAKS to match Tab Names
    for (i in ss.getSheets()){
      try {
        var pageBreak = pageBreaks[i].setTitle(teachers[i]);
        pageBreak.asPageBreakItem().setGoToPage(FormApp.PageNavigationType.SUBMIT)
      }
      // If there is an error, try and add a new PAGE_BREAK with the appropriate name
      catch(err){
        Logger.log(err)
        pageBreak = form.addPageBreakItem().setTitle(teachers[i])
        pageBreak.setGoToPage(FormApp.PageNavigationType.SUBMIT)
        Logger.log("Added PAGE_BREAK named %s",teachers[i])
      }
      Logger.log(pageBreak)
      // Add the items on the page - Lunch Count and Milk Count"
      /*form.addTextItem().setTitle("Lunch Count")*/
      // Pull the number of students, add them to bottom of the page
      var studentNames = getStudentNames(sheets[i])
      Logger.log("%s students in %s's class",j,teachers[i])
      form.addCheckboxItem().setTitle("Milk Count").setChoiceValues(studentNames)
      //Change Navigation to Submit
      form.addTextItem().setTitle("Number of Chocolate Milk")
    };
  }
  catch(err){
    Logger.log(err)
  };
  var firstItem = form.getItems()[0]
  firstItem.asMultipleChoiceItem()
  .setChoiceValues(teachers)
  // set navigation for each answer
  // have to do this manually :(
}

function updateStudents() {
 var classLists = form.getItems(FormApp.ItemType.CHECKBOX)
 for (i in classLists){
   var sheet = ss.getSheets()[i]
   var studentNames = getStudentNames(sheet)
   Logger.log(studentNames)
  classLists[i].asCheckboxItem().setChoiceValues(studentNames)
 }
}

function updateStaff(){
  var pageBreaks = form.getItems(FormApp.ItemType.PAGE_BREAK)
  var teacherNames = getTeacherNames()
  for (i in pageBreaks){
    pageBreaks[i].setTitle(teacherNames[i])
  }
}

function getTeacherNames(){
  var sheets = ss.getSheets()
  var teacher = new Array
  for (i in sheets){
   teacher[i] = sheets[i].getName() 
  }
  return teacher
}

function getStudentNames(sheet){
    try{
      var studentNames = sheet.getRange("A1:A").getValues()
      for (j in studentNames){
        //        Logger.log(studentNames[k].valueOf())
        if (studentNames[j].valueOf() != ''){
          Logger.log(studentNames[j])
        }
      }
    }catch(err){
        Logger.log("%s (%s)",i, err)
              i++

    }
  return studentNames
}

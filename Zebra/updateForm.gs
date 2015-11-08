function importOptionsToForm(){
  var items = form.getItems()
  var pages = form.getItems(FormApp.ItemType.PAGE_BREAK)
  var pagesArray = new Array()
  var staff = getStaff()
  var buildings = getBuildings()
  var buildingChoices = new Array()
  var students = getStudents()
  
  if (items.length < 3){
    //initial setup
    var email = form.addListItem()
    .setChoiceValues(staff)
    .setTitle("Select your email from the list")
    var class = form.addListItem()
    .setTitle("Where are the student(s) located")
    var time = form.addListItem()
    .setChoiceValues(["30 Minutes","45 Minutes","1 hour","2 hours","Indefinitely"]) //pull from Spreadsheet or User Input.
    .setTitle("How long shall we keep the user(s) in the Penalty Box?")
    }
  else{
    var email = items[0].asListItem()
    var class = items[1].asListItem()
    var time = items[2].asListItem()
    email.setChoiceValues(staff)
  }
  for (i in pages){
    pagesArray.push(pages[i].getTitle())
  }
  for (i=0;i<buildings.length;i++){
    var BuildingExists = new RegExp(buildings[i][0])
    if (BuildingExists.test(pagesArray)){
      for (j in pagesArray){
        if (BuildingExists.test(pagesArray[j])){
          a(buildings[i][0],form.getItems(FormApp.ItemType.PAGE_BREAK)[j].asPageBreakItem())}
      }
      continue
    }
    else{
      Logger.log("%s not found in %s",BuildingExists,pagesArray)
      var newPage = form.addPageBreakItem().setTitle(buildings[i][0])
      newPage.setGoToPage(FormApp.PageNavigationType.SUBMIT)
      pagesArray.push(newPage.getTitle())
      var pageNav = a(buildings[i][0],newPage)
      var newItem = form.addCheckboxItem()
      .setTitle(buildings[i][0]+" Students")
      }
  }
  class.setChoices(buildingChoices)
  var studentItems = form.getItems(FormApp.ItemType.CHECKBOX)
  for (i in studentItems){
    var theseStudents = getStudents(buildings[i][1])
    studentItems[i].asCheckboxItem()
    .setChoiceValues(theseStudents)
  }
  
  // internal functions  
  function getStaff(){
    var sheet = ss.getSheetByName("Staff")
    var numRows = sheet.getLastRow()
    var staff = sheet.getRange(2,1,numRows-1).getValues()
    return staff
  }
  function getBuildings(){
    var sheet = ss.getSheetByName("Staff")
    var numBuildings = sheet.getLastRow()
    var buildings = sheet.getRange(2,4,numBuildings,2).getValues()
    var that = new Array()
    for (i in buildings){
      var Test = new RegExp(buildings[i][0])
      switch(true){
        case Test.test(that):
          continue;
          break;
        default :
          that.push(buildings[i])
          break
      }
    }
    return that
  }
  function a(buildings,page){
    var that = []
    that.push(buildings)
    if (page){
      Logger.log("%s building; %s page; %s",buildings,page,class)
      buildingChoices.push(class.createChoice(buildings, page))
    }
    return that
  } 
  function getStudents(a){
    var sheet = ss.getSheetByName("Students")
    var numRows = sheet.getLastRow()
    var students = sheet.getRange(2,1,numRows-1,2).getValues()
    if(a){
      var that = students
      students = new Array()
      var limit = new RegExp(a)
      for(j in that){
        if (limit.test(that[j][1])){
          students.push(that[j][0])
        }
      }
      if (students < 1){students.push("No Students available")}
    }
    return students
  }
}

function clearForm(form){
  form
  var items= form.getItems().length;
  while(form.getItems().length!=0){        
    try{      
      form.deleteItem(0);
    } catch(error)
    {Logger.log(error);
    }
  }
}

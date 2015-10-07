function getStudents(scope){
 scope = "3rd Grade" //test scope - hard coded until I pull from UI/Spreadsheet
 var re = new RegExp(scope), page, pageToken, students = new Array(), student
 
 do{
   page = AdminDirectory.Users.list({
     maxResults:100,
     sortBy:"familyName",
     domain:domain,
     pageToken:pageToken
   })
   for (i in page.users){
     student = page.users[i]
     if (re.test(student.orgUnitPath)){
       students.push(student) 
     }}
   pageToken = page.nextPageToken
 }
   while(pageToken){}
  Logger.log(students.length)
  return students
}

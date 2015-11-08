function getScope(scope){
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
       students.push(student.primaryEmail) 
     }}
   pageToken = page.nextPageToken
 }
   while(pageToken){}
  return students
}

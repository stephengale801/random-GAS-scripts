function listAllStudents() {
  //var re = new RegExp("Student"), allUsers = new Array(),
  var query = 'orgUnitPath = "Student"'
  var sheet = SpreadsheetApp.getActive().getActiveSheet()
  
  var pageToken, page, now
  now = new Date();
  do {
    page = AdminDirectory.Users.list({
      domain: Session.getEffectiveUser().getEmail().split("@")[1],
      orderBy: 'familyName',
      query: query,
      maxResults: 100,
      pageToken: pageToken
    });
    var users = page.users;
    if (users) {
      for (var i = 0; i < users.length; i++) {
        var user = users[i];
        sheet.appendRow([user]);
        
        //        if (re.test(user.orgUnitPath)){
        //        allUsers.push(user)
        //        }
        
      }
    } else {
      Logger.log('No users found.');
    }
    pageToken = page.nextPageToken;
  } while (pageToken);
  // return allUsers
}

function listAllStudents() {
  var re = new RegExp("Student"), allUsers = new Array()

  var pageToken, page, now
  now = new Date();
  do {
    page = AdminDirectory.Users.list({
      domain: 'YOUR_DOMAIN',
      orderBy: 'givenName',
      maxResults: 100,
      pageToken: pageToken
    });
    var users = page.users;
    if (users) {
      for (var i = 0; i < users.length; i++) {
        var user = users[i];
        //you can add parameters to check OUs 
        if (re.test(user.orgUnitPath)){
        allUsers.push(user)
        }
      }
    } else {
      Logger.log('No users found.');
    }
    pageToken = page.nextPageToken;
  } while (pageToken);
  return allUsers
}

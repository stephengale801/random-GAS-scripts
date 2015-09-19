function listAllStudents() {
  var re = new RegExp("Student"), inactiveUsers = new Array()

  var pageToken, page, now
  now = new Date();
  do {
    page = AdminDirectory.Users.list({
      domain: 'YOUR_DOMAIN',
      orderBy: 'familyName',
      maxResults: 100,
      pageToken: pageToken
    });
    var users = page.users;
    if (users) {
      for (var i = 0; i < users.length; i++) {
        var user = users[i];
        //you can add parameters to check OUs 
        if (re.test(user.orgUnitPath)){
          if (Date.parse(now) - Date.parse(user.creationTime) < (1000*60*60*24*30)) {
          Logger.log('%s (%s). - %s', user.primaryEmail, user.creationTime, user.lastLoginTime);
          inactiveUsers.push(user)
          }
        }
      }
    } else {
      Logger.log('No users found.');
    }
    pageToken = page.nextPageToken;
  } while (pageToken);
  return inactiveUsers
}

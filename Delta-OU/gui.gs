var DOMAIN = Session.getEffectiveUser().getEmail().split("@")[1]
var ss = "YOUR_SPREADSHEET_ID"

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
  .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}

function doSomething() {
  var htmlOption = new Array
  var userSheet = ss.getSheets()[0]
  var scope = getUserScope(userSheet)
  var userScope = new RegExp(scope.scopeA)
  var parentScope = new RegExp(scope.scopeB)
  var customerId = 'my_customer';
  var domain = DOMAIN;  // temporary hard coded
  var pageToken, page
  var scopeA = new Array;
  var scopeB = new Array;
  
  //getAll OUs
  do{
    page = AdminDirectory.Orgunits.list(customerId,{
      domain: domain,
      type: 'all',
      maxResults: 100,
      pageToken: pageToken
    });
    for (i=0 ; i < page.organizationUnits.length; i++ ){
      if (userScope.test(page.organizationUnits[i].parentOrgUnitPath)){
        scopeA.push(page.organizationUnits[i])
      }
      if (parentScope.test(page.organizationUnits[i].parentOrgUnitPath)){
          scopeB.push(page.organizationUnits[i])
      }
    }
    pageToken = page.nextPageToken;
  }
  while(pageToken);
  for (i in scopeB){
    htmlOption[i] = {parentValue: '',
                     parentName: '',
                     targetValue: scopeB[i].orgUnitPath,
                     targetName: scopeB[i].orgUnitPath}
  }
  for (i in scopeA){
    htmlOption[i].parentValue = scopeA[i].orgUnitPath,
    htmlOption[i].parentName = scopeA[i].name
  }
  return htmlOption;
}

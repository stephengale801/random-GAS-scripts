function Initialize() {
  //run checks to see what is present - execute next function in sequence;
  var status, staffCell, studentCell, buildingCell, formPopulateCell, submitCell, timeCell, editCell
  
  staffCell = statusSheet.getRange("D2")
  studentCell = statusSheet.getRange("D3")
  buildingCell = statusSheet.getRange("D4")
  formPopulateCell = statusSheet.getRange("D5")
  submitCell = statusSheet.getRange("D6")
  timeCell = statusSheet.getRange("D7")
  editCell = statusSheet.getRange("D8")
  
  var status = {
    staffImported: staffCell.getValue(),
    studentsImported: studentCell.getValue(),
    buildingsPopulated: buildingCell.getValue(),
    formPopulate: formPopulateCell.getValue(),
    submitTrigger: submitCell.getValue(),
    timeTrigger: timeCell.getValue(),
    onEditTrigger: editCell.getValue()
  }
  while (status.timeTrigger == ''){
    switch(true){
      case (status.staffImported == ''): //1
        updateStaff()
        staffCell.setValue("Staff Imported ✓")
        .setBackground("Green")
        .setHorizontalAlignment("center")
        updateAuditLog([new Date(), Session.getActiveUser(), "Inital installation - Imported Staff: Success"])
        status.staffImported = staffCell.getValue()
        break;
      case (status.studentsImported == ''): //2
        updateStudents()
        studentCell.setValue("Students Imported ✓")
        .setBackground("Green")
        .setHorizontalAlignment("center")
        updateAuditLog([new Date(), Session.getActiveUser(), "Inital installation - Imported Students: Success"])
        status.studentsImported = studentCell.getValue()
        break;
      case (status.buildingsPopulated == ''): //3
        var buildingsRange1 = PenaltyOUSheet.getRange("B2")
        .setValue('=Unique(FILTER(Students!B2:B,not(ARRAYFORMULA(REGEXMATCH(Students!B2:B, "Penalty")))))')
        var buildingsRange2 = staffSheet.getRange("D2")
        .setValue('=Unique(FILTER('+"'Penalty Box'!C2:C,not(ARRAYFORMULA(REGEXMATCH('Penalty Box'!C2:C,"+'"Penalty|Error")))))')        
        buildABox()
        buildingCell.setValue("Penalty Box Created ✓")
        .setBackground("Green")
        .setHorizontalAlignment("center")
        updateAuditLog([new Date(), Session.getActiveUser(), "Inital installation - Build-a-Box: Success"])
        status.buildingsPopulated = buildingCell.getValue()
        break;
      case (status.formPopulate == ''): //4
        importOptionsToForm(form)
        formPopulateCell.setValue("Zebra Form Updated ✓")
        .setBackground("Green")
        .setHorizontalAlignment("center")
        updateAuditLog([new Date(), Session.getActiveUser(), "Inital installation - Updated Zebra Form: Success"])
        status.formPopulate = formPopulateCell.getValue()
        break;
      case (status.submitTrigger == ''): //5
        installOnSubmit()
        submitCell.setValue("Submit Trigger Installed ✓")
        .setBackground("Green")
        .setHorizontalAlignment("center")
        updateAuditLog([new Date(), Session.getActiveUser(), "Inital installation - Installed Submit Trigger: Success"])
        status.submitTrigger = submitCell.getValue()
        break;
      case (status.timeTrigger == ''): //6
        installTimeTrigger()
        timeCell.setValue("Time Trigger Installed ✓")
        .setBackground("Green")
        .setHorizontalAlignment("center")
        updateAuditLog([new Date(), Session.getActiveUser(), "Inital installation - Installed Time Trigger: Success"])
        status.timeTrigger = timeCell.getValue()
        break;
//      case (status.onEditTrigger == ''): //7
//        installOnEdit()
//        editCell.setValue("Edit Trigger Installed ✓")
//        .setBackground("Green")
//        .setHorizontalAlignment("center")
//        updateAuditLog([new Date(), Session.getActiveUser(), "Inital installation - Installed Time Trigger: Success"])
//        status.onEditTrigger = editCell.getValue()
//        break;
    }
  }
  var URL = form.getPublishedUrl()
  var HTML = ''
  HTML += '<h2><a id="user-content-httpsgooglppd6ab" class="anchor" href="#httpsgooglppd6ab" aria-hidden="true"><span class="octicon octicon-link"></span></a><a href="https://goo.gl/pPD6AB">https://goo.gl/pPD6AB</a></h2>'
  HTML += '<p>view only GAS-Editor</p> <p>Here\'s the link to your ZEBRA form: '+URL+'</p>'
  HTML += '<h1><a id="user-content-zebra" class="anchor" href="#zebra" aria-hidden="true"><span class="octicon octicon-link"></span></a>Zebra</h1>'
  HTML += '<p>is a referee style application (hopefully addon) which allows Google Apps Administrators to delegate sending users to a pre-built Penalty Box OU.  The idea being that the Penalty Box would have restricted settings and limited navigation capability.  Users are sent there as part of some disciplinary action.  The name is derived from my days watching our High School\'s hockey team and being kicked out of more than one match for chanting at the refs "Zebra zebra short and stout, find your head and pull it out."</p>'
  HTML += '<h2><a id="user-content-setup" class="anchor" href="#setup" aria-hidden="true"><span class="octicon octicon-link"></span></a>Setup</h2>'
  HTML += '<p>Start by copying all the contained files into a single <strong>Google Apps Script</strong> project.  Each .gs file can be compiled into a single script file or can be split into the files as outlined.  <strong>Enable the appropriate <strong>Advanced Services</strong> to allow the script access to the AdminSDK</strong></p>'
  HTML += '<p><strong>Enable the "AdminSDK" in the Advanced Google Services <i>and</i> the Google Developers Console.  The link to the Google Developers Console for this project will be found in the same popup menu as the Advanced Google Services.</strong></p>'
  HTML += '<p>Run the function <strong>initialize()</strong> found in the file Triggers.gs.  If you are running the script on a new Spreadsheet without a form attached, you will have to run the function twice (x2) - the first time will create the form and attach it to the Spreadsheet.  The second time will complete the rest of the configuration.</p>'
  HTML += '<p>You can check the current progress of the installation by going to the "Status" sheet withing the Spreadsheet.  An Editor to the form will then have to populate the Scope for each staff member.  Without this, users will be able to submit the form, but nothing will happen other than an audit log will be created stating they weren\'t permitted to move the user. </p>'
  HTML += '<p><strong><em>TODO:</em></strong> Upon final completion, send an email to the user with a shortened link to the <strong>Google Form</strong>.</p>'
  HTML += '<h2><a id="user-content-note" class="anchor" href="#note" aria-hidden="true"><span class="octicon octicon-link"></span></a>NOTE:</h2>'
  HTML += '<p>Restrictions will still need to be set for the <b>Penalty Box</b> OU.  <strong>Failure to do so will result in <em>unrestricted access</em> rather than restricted access</strong>. It is recommended that the settings are made to the <em>Parent Penalty Box OU</em> with exceptions made to the children OUs.</p>'
  HTML += '<h2><a id="user-content-end-user-usage-what-the-teachers-see" class="anchor" href="#end-user-usage-what-the-teachers-see" aria-hidden="true"><span class="octicon octicon-link"></span></a>End User usage (What the Teachers See)</h2>'
  HTML += '<p>Navigate to the <strong>live version</strong> of the <strong>Zebra Form</strong>, created in the installation process.  Users select their email address (used for verification later), where the users are located at and how long to leave them in the Penalty Box from a Dropdown box.  On the next page, they select which students to move, and submit the form.</p>'
  HTML += '<p>Upon submission, a trigger will fire, executing the <strong>redCard()</strong> function, sending the user to the penalty box for their OrgUnit. Once the duration has passed, the user will be placed back into their former OU.</p>'
  HTML += '<h2><a id="user-content-scope" class="anchor" href="#scope" aria-hidden="true"><span class="octicon octicon-link"></span></a>Scope</h2>'
  HTML += '<p>Defining a scope will restrict which OUs authorized staff will be able to referee.  <em>Seems to be working, but needs verification</em>.  By Default, Staff\'s scope is empty.  Should there be a desire, this setting could be change.  The Scope cells support | (pipes) and all children OUs inherrit their parent scope settings. </p>'
  HTML += '<h2><a id="user-content-audit-log" class="anchor" href="#audit-log" aria-hidden="true"><span class="octicon octicon-link"></span></a>Audit Log</h2>'
  HTML += '<p>Because this involves moving users and executes the redCard() <strong>function as the GAFE Administrator</strong> from Google\'s Reporting perspective, <em>Auditing</em> is important.  The audit log will be updated every time a user is moved either by the submission of the script or when their duration runs out.  Errors, such as if there is a username mismatch or an attempted scope violation, are also logged without executing the redCard() function. All other errors are also logged.</p>'
  HTML += '<h1><a id="user-content-functions" class="anchor" href="#functions" aria-hidden="true"><span class="octicon octicon-link"></span></a>Functions:</h1>'
  HTML += '<p><strong>Triggers.gs</strong><br>'
  HTML += '<em>Initialize()</em> - runs all functions in proper order in.  Has built-in checks to make sure that if the execution goes longer than planned it can pickup where it left off by re-running the Initialize() function. </p>'
  HTML += '<p><em>installOnEdit()</em> - is one of the triggers that is <strong>not</strong> installed by the Initialize() function (perhaps at a later date).  This function installs an "onEdit" trigger to the Spreadsheet where, when the spreadsheet is edited, the Form is updated.  This was removed due to the excessive number of Edits taking place on the Spreadsheet.  <strong>A range limiter will need to be added to the importOptionsToForm() function.</strong></p>'
  HTML += '<p><em>installOnSubmit()</em> - attaches the Form submit function to the redCard() function.</p>'
  HTML += '<p><em>installTimeTrigger()</em> - attaches a trigger that runs checkExpiration() every 3 minutes (can change to every minute if needed)</p>'
  HTML += '<p><em>checkExpiration()</em> - checks to see if any <em>Current Offenders</em> should be removed from the Penalty Box. </p>'
  HTML += '<p><strong>Build-A-Box.gs</strong><br>'
  HTML += '<em>buildABox()</em> - creates a new <b>Penalty Box</b> OU at the Root of your OU Structure unless one exists with that name, in which case, it uses that OU.  This function should also create sub-OUs based on where your Users are found.  A matrix is created, associating the original OU and the penalty box sub-OU. These values are used toput users back into their original OU when their time in the Penalty Box is over.</p>'
  HTML += '<p><em>clearPenaltyBox()</em> - removes all sub-OUs of the root defined Penalty Box.  If there are users in the Penalty Box at the time, that individual sub-OU will not be deleted.</p>'
  HTML += '<p><strong>redCard.gs</strong> is in the <em>BETA</em> phase.<br>'
  HTML += '<em>redCard()</em> - is the function which is attached to the onSubmit() trigger for the associated form.  When triggered, if the SessionUser has been authorized in the <em>scope</em> and selected their name in the drop-down menu, The selected students will be moved into the appropriate <em>Penalty Box OU</em>.  The AuditLog is triggered and records a line for every student moved, or if any errors occur.</p>'
  HTML += '<p><em>updateAuditLog()</em> - basic function to update range of the Audit Log Sheet with pertinent information.</p>'
  HTML += '<p><strong>importFromGoogle.gs</strong><br>'
  HTML += '<em>updateStaff()</em> - pulls data from the AdminDirectory inlcuding OU Structure, Staff Email addresses and stores the information statically on the Staff Sheet.  This is later used to build populate the Google Form which is used to deliver the User Experience.</p>'
  HTML += '<p><em>updateStudents()</em> - same as updateStaff(), except for students. </p>'
  HTML += '<p><strong>updateForm.gs</strong><br>'
  HTML += '<em>importOptionsToForm(form)</em> - builds the form structure, populates questsions, changes user navigation based on answer... everything to make the End User\'s experience as simplified as possible.</p>'
  HTML += '<p><em>clearForm(form)</em> removes all items from the existing form.  Former submissions are still stored and upon new creation will be listed in a separate column in the Form Response page. -- basically there to make my life easier during development.</p>'
  HTML += '<p><strong>scope.gs</strong><br>'
  HTML += '<em>getScope(scope)</em> - used by the script to determine whether the Session User has permission to make the requested changes.  <strong>This may be enough where having the user select their email might not be necessary,</strong> though selecting email would still be necessary if we wanted to limit their Building selections at a later date.</p>'
  
  GmailApp.sendEmail(Session.getEffectiveUser(), "ZEBRA Form Information", "Here's the link to your ZEBRA form: "+URL , {replyTo: "gales@wgsd.us",htmlBody:HTML})
}
function installOnEdit(){
  ScriptApp.newTrigger("importOptionsToForm")
  .forSpreadsheet(ss)
  .onEdit()
  .create()
}
function installOnSubmit(){
  ScriptApp.newTrigger("redCard")
  .forForm(form)
  .onFormSubmit()
  .create()
}
function installTimeTrigger(){
  ScriptApp.newTrigger("checkExpiration")
  .timeBased()
  .everyMinutes(5)
  .create()
}

function checkExpiration(){
  if (currentBoxUsersSheet.getLastRow() > 1){
    var sheet = auditLogSheet
    var LastRow = sheet.getLastRow()
    var range = sheet.getRange("A2:G"+LastRow)
    for (i = 0; i < range.getValues().length; i++){
      var rowIndex = new Number(i)+2
      var isExpired = range.getValues()[i][6]
      var student = range.getValues()[i][0]
      if (!isExpired){continue}
      else {
        //Add Marker to show that the line has been previously processed. (Background Color, etc)
        
        var status = isRedCarded(student)
        if (status != false){
          Logger.log(status.newLocationId)
          var resource = {orgUnitPath: status.newLocation}
          AdminDirectory.Users.update(resource, status.email)
          updateAuditLog([student,"Zebra - Times Up",status.newLocation,"Indefinitely",new Date(),"",
                          "=IF(NOT(ISBLANK(F"+LastRow+1+")),(F"+LastRow+1+"-NOW())<0,F"+LastRow+1+")"])
        }
      }
    }
    updateStudents()
  }
  
  //internal functions
  function isRedCarded(student){
    student = {email : student,
               currentLocation : '',
               currentLocationId : '',
               newLocation : '',
               newLocationId : ''}
    
    var currentOffenders = currentBoxUsersSheet.getRange("A2:C"+currentBoxUsersSheet.getLastRow()).getValues()
    var re = new RegExp(student.email)
    if (re.test(currentOffenders)){
      var j=0
      while(j < currentOffenders.length){
        if (currentOffenders[j][0] == student.email){
          student.currentLocation = currentOffenders[j][1]
          var LastRow = PenaltyOUSheet.getLastRow()
          var matrix = PenaltyOUSheet.getRange("B2:G"+LastRow).getValues()
          for (var k = 0; k < matrix.length; k++){
            if (matrix[k][3] == student.currentLocation){
              student.currentLocationId = matrix[k][4]
              student.newLocation = matrix[k][0]
              student.newLocationId = matrix[k][2]
              return student
            }
          }
        }
        j++;
      }
    }
    return false
  }//end isRedCarded()
}

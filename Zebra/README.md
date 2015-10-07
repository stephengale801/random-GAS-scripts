#Zebra
is a referee style application (hopefully addon) which allows Google Apps Administrators to deligate sending users to a pre-build Penalty Box OU.  The idea being that the Penalty Box would have restricted settings and limited navigation capability.  Users are sent there as part of some disciplinary action.

##Setup
At present, Setup involves creating a Google Form, recording the form ID as well as your Google Apps Domain name in the "importFromGoogle.gs" file.  All files in this collection should be contained within one Google Apps Script project.

**Enable the "AdminSDK" in the Advanced Google Services <i>and</i> the Google Developers Console.  The link to the Google Developers Console for this project will be found in the same popup menu as the Advanced Google Services.**

##Running functions and Order of Execution 
The setup functions are found in the importFromGoogle.gs and will only need to be run when changes need to be made to the list of Staff or Students.  There are 2 functions, one to <b>imporStaff</b> and one to <b>importStudents</b>.  The functions work under the assumption that your staff are contained in an OU with the word "Staff" in it.  Likewise, the assumption is that students are within an OU with "Students" in the name.  <b>All</b> sub OUs of both Staff and Students will be included, except for those listed in the "Exceptions" array.  By default OUs with the name Graduating or Suspended will be excluded from both.  To change any of these assumptions, change the string within the file to match your OU structure.

Once staff and students are imported, a division needs to be made to prevent all the Students from apearing in one Checkbox list.  This division is called buildings, though it may represent something much smaller (Grades or Graduating Class Years).  This will be imported based on your OU structure as well.

At present, there is no "getBuildings()" function.  The location of the buildings is Column 4 and 5 of the "Staff" sheet of the form results.  Column 4 is the separation as it will appear in the Form and column 5 is a unique value that will be used in a Regular Expression to define the OU. Lack of this function is the first fix that needs to be made.

Once buildings are defined - the function "importOptionsToForm" on updateForm.gs can be run.  This function makes changes to the Google Form that was defined during setup.  The form should be blank before running the function.  If there are items on the form, there is a "clearForm" function included in the updateForm.gs file as well.

All other files are for the functionality of the addon.

##End User usage
At present, there is no actual functionality other than populating a very elaborate form.
When the missing files are in place, a user will select their name from a dropdown menu (used for verification later).  They will then select a "building" and a duration for the student to be placed into the Penalty Box.  Based on their Building Choice, they will then be sent to the page they selected, which will include a checkbox list of all the users in that "building" (OU).

Upon submission, a trigger will fire, executing the redCard() function, sending the user to the penalty box closest to them in the OU structure.

Once the duration has passed, the user will be placed back into their former OU.

##Scope
Defining a scope will restrict which OUs authorized staff will be able to referee.  **Coming soon - I hope.

##Audit Log
Because this involves moving users and executes the redCard() function as the GAFE Administrator, Auditing is important.  The audit log will be updated every time a user is moved either by the submission of the script or when their duration runs out.  If there is a username mismatch or an attempted scope violation, it will be logged and shouldn't execute the redCard(). Any and all errors will also be logged.

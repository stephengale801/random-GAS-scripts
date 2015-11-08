#Zebra
is a referee style application (hopefully addon) which allows Google Apps Administrators to deligate sending users to a pre-build Penalty Box OU.  The idea being that the Penalty Box would have restricted settings and limited navigation capability.  Users are sent there as part of some disciplinary action.  The name is derived from my days watching our High School's hockey team and being kicked out of more than one match for chanting at the refs "Zebra zebra short and stout, find your head and pull it out."

##Setup
At present, Setup involves creating a Google Form, recording the form ID as well as your Google Apps Domain name in the "importFromGoogle.gs" file.  All files in this collection should be contained within one Google Apps Script project.

**Enable the "AdminSDK" in the Advanced Google Services <i>and</i> the Google Developers Console.  The link to the Google Developers Console for this project will be found in the same popup menu as the Advanced Google Services.**

##Running functions and Order of Execution 
The setup functions are found in the importFromGoogle.gs and will only need to be run when changes need to be made to the list of Staff or Students.  There are 2 functions, one to <b>importStaff</b> and one to <b>importStudents</b>.  The functions work under the assumption that your staff are contained in an OU with the word "Staff" in it.  Likewise, the assumption is that students are within an OU with "Students" in the name.  <b>All</b> sub OUs of both Staff and Students will be included, except for those listed in the "Exceptions" array.  By default OUs with the name Graduating or Suspended will be excluded from both.  To change any of these assumptions, change the string within the file to match your OU structure.

Once staff and students are imported, a division needs to be made to prevent all the Students from apearing in one Checkbox list.  This division is called buildings, though it may represent something much smaller (Grades or Graduating Class Years).  This will be imported based on your OU structure as well.

The location of the buildings is Column 4 and 5 of the "Staff" sheet of the form results.  Column 4 is the separation as it will appear in the Form and column 5 is a unique value that will be used in a Regular Expression to define the OU.  Example: column4 = Class of 2016, Class of 2017, Class of 2018... column5 = 2016, 2017, 2018... 
The Buildings will populate themselves, but the RegExp will need to be manually filled in. _-By default, the names will be filled in as the RegExp-_.

Once buildings are defined - the function "importOptionsToForm" on updateForm.gs can be run.  This function makes changes to the Google Form that was defined during setup.  The form should be blank before running the function.  If there are items on the form, there is a "clearForm" function included in the updateForm.gs file as well.

<b>Just Added</b>: Build-A-Box.gs.<br>Run the function <b>buildABox()</b> to create a new <b>Penalty Box</b> OU at the Root of your OU Structure.  This function should also create sub-OUs based on where your Users are found.  This will record the designated Penalty Box for the original User location.  These values are important for putting users back into their original OU when their time in the Penalty Box is over.

Triggers.gs contains 4 Triggers that make the Addon work with the Spreadsheet and the Form.  *Initialize()* has not been scripted, but will be the function that automates the preceeding functions in the Addon interface.  *installOnEdit()* runs the function "updateForm" every time an edit is made to the Spreadsheet.... I haven't installed and tried this myself, but it's there as part of the Alpha.  DO NOT INSTALL unless you know how to remove the trigger, just incase.  *installOnSubmit()* is the primary function's (redCard's)  trigger, causing users to be moved to the Penalty Box on a form submit. And *installTimeTrigger()* runs the "isExpired" function to see if a user should be put back into their original OrgUnit.

All other files are for the functionality of the addon.

##End User usage
At present, there is no actual functionality other than populating a very elaborate form.
When the missing files are in place, a user will select their name from a dropdown menu (used for verification later).  They will then select a "building" and a duration for the student to be placed into the Penalty Box.  Based on their Building Choice, they will then be sent to the page they selected, which will include a checkbox list of all the users in that "building" (OU).

Upon submission, a trigger will fire, executing the redCard() function, sending the user to the penalty box closest to them in the OU structure.

Once the duration has passed, the user will be placed back into their former OU.

##Scope
Defining a scope will restrict which OUs authorized staff will be able to referee.  *Seems to be working, but needs verification*.

##Audit Log
Because this involves moving users and executes the redCard() function as the GAFE Administrator, Auditing is important.  The audit log will be updated every time a user is moved either by the submission of the script or when their duration runs out.  If there is a username mismatch or an attempted scope violation, it will be logged and shouldn't execute the redCard(). Any and all errors will also be logged.

## redCard.gs is in the ALPHA phase.
_-There are still *a lot* of items that need to be addressed before BETA.-_  Things are getting much better, though more testing is required...<br>
This is the function which is attached to the onSubmit() trigger for the associated form.  When triggered, if the SessionUser has been authorized in the *scope* and selected their name in the drop-down menu, The selected students will be moved into the appropriate *Penalty Box OU*.  The AuditLog is triggered and records a line for every student moved, or if any errors occur.

##NOTE:
Restrictions will still need to be set for the <b>Penalty Box OU</b>.  *Failure to do so will result in _unrestricted access_ rather than restricted access*. It is recommended that the settings are made to the *Parent Penalty Box OU* with exceptions made to the children OUs. 

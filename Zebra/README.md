##https://goo.gl/pPD6AB
view only GAS-Editor

#Zebra
is a referee style application (hopefully addon) which allows Google Apps Administrators to delegate sending users to a pre-built Penalty Box OU.  The idea being that the Penalty Box would have restricted settings and limited navigation capability.  Users are sent there as part of some disciplinary action.  The name is derived from my days watching our High School's hockey team and being kicked out of more than one match for chanting at the refs "Zebra zebra short and stout, find your head and pull it out."

##Setup
Start by copying all the contained files into a single **Google Apps Script** project.  Each .gs file can be compiled into a single script file or can be split into the files as outlined.  **Enable the appropriate __Advanced Services__ to allow the script access to the AdminSDK**

**Enable the "AdminSDK" in the Advanced Google Services <i>and</i> the Google Developers Console.  The link to the Google Developers Console for this project will be found in the same popup menu as the Advanced Google Services.**

Run the function **initialize()** found in the file Triggers.gs.  If you are running the script on a new Spreadsheet without a form attached, you will have to run the function twice (x2) - the first time will create the form and attach it to the Spreadsheet.  The second time will complete the rest of the configuration.

You can check the current progress of the installation by going to the "Status" sheet withing the Spreadsheet.  An Editor to the form will then have to populate the Scope for each staff member.  Without this, users will be able to submit the form, but nothing will happen other than an audit log will be created stating they weren't permitted to move the user. 

~~***TODO:*** Upon final completion, send an email to the user with a shortened link to the **Google Form**.~~

##NOTE:
Restrictions will still need to be set for the <b>Penalty Box</b> OU.  **Failure to do so will result in _unrestricted access_ rather than restricted access**. It is recommended that the settings are made to the *Parent Penalty Box OU* with exceptions made to the children OUs.

##End User usage (What the Teachers See)
Navigate to the __live version__ of the **Zebra Form**, created in the installation process.  Users select their email address (used for verification later), where the users are located at and how long to leave them in the Penalty Box from a Dropdown box.  On the next page, they select which students to move, and submit the form.

Upon submission, a trigger will fire, executing the **redCard()** function, sending the user to the penalty box for their OrgUnit. Once the duration has passed, the user will be placed back into their former OU.

##Scope
Defining a scope will restrict which OUs authorized staff will be able to referee.  *Seems to be working, but needs verification*.  By Default, Staff's scope is empty.  Should there be a desire, this setting could be change.  The Scope cells support | (pipes) and all children OUs inherrit their parent scope settings. 

##Audit Log
Because this involves moving users and executes the redCard() __function as the GAFE Administrator__ from Google's Reporting perspective, *Auditing* is important.  The audit log will be updated every time a user is moved either by the submission of the script or when their duration runs out.  Errors, such as if there is a username mismatch or an attempted scope violation, are also logged without executing the redCard() function. All other errors are also logged.

#Functions:
**Triggers.gs**<br>
_Initialize()_ - runs all functions in proper order in.  Has built-in checks to make sure that if the execution goes longer than planned it can pickup where it left off by re-running the Initialize() function. 

_installOnEdit()_ - is one of the triggers that is **not** installed by the Initialize() function (perhaps at a later date).  This function installs an "onEdit" trigger to the Spreadsheet where, when the spreadsheet is edited, the Form is updated.  This was removed due to the excessive number of Edits taking place on the Spreadsheet.  __A range limiter will need to be added to the importOptionsToForm() function.__

_installOnSubmit()_ - attaches the Form submit function to the redCard() function.

_installTimeTrigger()_ - attaches a trigger that runs checkExpiration() every 3 minutes (can change to every minute if needed)

_checkExpiration()_ - checks to see if any *Current Offenders* should be removed from the Penalty Box. 

**Build-A-Box.gs**<br>
_buildABox()_ - creates a new <b>Penalty Box</b> OU at the Root of your OU Structure unless one exists with that name, in which case, it uses that OU.  This function should also create sub-OUs based on where your Users are found.  A matrix is created, associating the original OU and the penalty box sub-OU. These values are used toput users back into their original OU when their time in the Penalty Box is over.

_clearPenaltyBox()_ - removes all sub-OUs of the root defined Penalty Box.  If there are users in the Penalty Box at the time, that individual sub-OU will not be deleted.

**redCard.gs** is in the *BETA* phase.<br>
_redCard()_ - is the function which is attached to the onSubmit() trigger for the associated form.  When triggered, if the SessionUser has been authorized in the *scope* and selected their name in the drop-down menu, The selected students will be moved into the appropriate *Penalty Box OU*.  The AuditLog is triggered and records a line for every student moved, or if any errors occur.

_updateAuditLog()_ - basic function to update range of the Audit Log Sheet with pertinent information.

**importFromGoogle.gs**<br>
_updateStaff()_ - pulls data from the AdminDirectory inlcuding OU Structure, Staff Email addresses and stores the information statically on the Staff Sheet.  This is later used to build populate the Google Form which is used to deliver the User Experience.

_updateStudents()_ - same as updateStaff(), except for students. 

**updateForm.gs**<br>
_importOptionsToForm(form)_ - builds the form structure, populates questsions, changes user navigation based on answer... everything to make the End User's experience as simplified as possible.

_clearForm(form)_ removes all items from the existing form.  Former submissions are still stored and upon new creation will be listed in a separate column in the Form Response page. -- basically there to make my life easier during development.

**scope.gs**<br>
_getScope(scope)_ - used by the script to determine whether the Session User has permission to make the requested changes.  **This may be enough where having the user select their email might not be necessary,** though selecting email would still be necessary if we wanted to limit their Building selections at a later date.

##Sync OU to Group
####This Script Requires AdminSDK to be enabled in order to work.

##Setup
####All files are saved in a single Google Apps Script project as separate script files.
--<b>First</b> - Change all instances of "YOURDOMAIN" to a string matching the domain you're administering.--

<b>Second</b> - Change all instances of "SPREADSHEET_ID" to the ID of a new Spreadsheet which you have edit privileges to.

<b>Third</b> - Change the array a[] within the file SyncGroups.gs to match a Comma Separated List of the Groups you're wanting to sync. Example: a = ["Class of 2016", "Class of 2017", "Class of 2018"] 

####This script will not create any new groups or OUs.  All groups and OUs must be created beforehand.
##Execution
Once all setup changes have been made, Start by running the functions in ImportOU.gs - importOUs(), WhereMyUsersAt(), WhereMyChromiesAt() [optional].  These functions will import all user and chrome device information necessary for the other functions to execute into the defined Spreadsheet.

After OU, User, and Chrome information has been imported - run the function within ImportGroups.gs - getAllGroupUsers(). This will import the Groups, their names and current members into the second Sheet of the Spreadsheet.

Once the Groups have been imported, execute the function within SyncGroups.gs - syncGroups().

This is an extremely long process, and will only sync around <b>3-4 groups </b> at any given time, based on the number of users.  This is the reason that the array a[] is defined.  Upon completion, make sure that all targeted groups were synced and that the execution didn't time out.  In the event that the script timed out, remove the Groups from a[] which completed and re-run the syncGroup() function.

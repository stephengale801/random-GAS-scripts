###Setup
####Enable the AdminSDK library.
Change "YOURDOMAIN" to the name of the Domain which you manage.

This script removes all pages from a site and transfers ownership of that site to the user executing the script.

Google Apps Script no longer contains an API call to delete a site - this must be done manually through the GUI. 

###RemoveUser.gs
A script which will remove a user's role from all sites that don't match the Exceptions.
Change the values for <b>domain</b>, <b>user</b>, and <b>exception</b> to match your criteria.

Could have also been done using a <i>for/case</i> loop in place of the multiple <i>if</i> statements. 

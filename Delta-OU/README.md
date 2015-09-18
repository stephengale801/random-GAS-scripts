The object of this project is to easily assign the ability to move an OU containing Users or Computers or both from one parent OU to another.  The idea being that the "targetOU" acts as a container, having all settings inherrited.  When the Target is placed into a "newParentOU", it receives all the settings of it's new Parent.

Authorized Session Users (Session.getActiveUser()) are stored in a Spreadsheet, along with the scope which they are allowed to change to/from (separate columns, 3 total)

An Audit of executions is stored in the same Spreadsheet under the tab "DeltaOU Audit".  The Audit includes Session User, TimeStamp targetOU, Original Parent OU, newParentOU, and Success/Fail/Retry status.

Proof of concept.  Quickly search through a Google Sheet for a given value.
Bruteforce (check every row until you get the correct one) method takes approx. 3 seconds for a 1000 row Sheet.
This method takes approx. .3 seconds for the same sheet.

Values in the sheet must be unique for this method to work.  The Spreadsheet referenced is Public and contains numbers 1 - 1000 in col A and 1000 unique random numbers in col B.

*TODO:* would like to be able to return multiple rows, or handle non-unique values. 

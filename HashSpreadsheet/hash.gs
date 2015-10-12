function test() {
  var ss = SpreadsheetApp.openById("1r8-pjJGmiNwXGsIftg3zkEuKmMKBuG9Ldc_MZpFyEYo");
  var sheet = ss.getSheets()[0];
  var lastRow = sheet.getLastRow();
  
  var x = getRandomInt(1,lastRow)
  var y = 2; //1 for 1ntegers, 2 for random values 
  x = sheet.getRange(x,y).getValue()
  Logger.log("Searching for %s",x);
  var hashedValue = hash(sheet,lastRow,x,y);
  Logger.log("hashedValue = %s",hashedValue);
  
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
}
function hash(sheet,n,x,y){
  //searching for x in column y
  var min = 1, mid = (1+(n-1)/2);
  var  max = n, that, i=0;
  x = ","+x.toString()+",";
  var re = new RegExp(x,"i");
  var gap = max-min;
  
  while ((that != x) && (min >= 0) && (max <= n) && (gap >= 4) && (i <= n)){
    var gap = Math.floor(max)-Math.floor(min);
    var floor = sheet.getRange(min, y, Math.ceil(gap/2)).getValues();
    var ceiling = sheet.getRange(mid, y, Math.ceil(gap/2)).getValues();
    switch(true){
      case re.test(floor.toString()):
        max = mid;
        that = floor.toString();
        break;
      case re.test(ceiling.toString()):
        min = mid;
        that = ceiling.toString();
        break;
      default:
        that = x
        break;
    }
    mid = Math.floor(min+(max-min)/2);
    i++
  }
  for (var j = min; j < max; j++){
    if(sheet.getRange(j, y).getValue() == x.substring(1,x.length-1)){
     that = sheet.getRange(j,y).getValue();
     return that;
    }
  }
  return that;
}

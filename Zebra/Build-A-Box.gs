function getPenaltyBoxes(OUs,searchFor){
  if (!OUs){
    OUs = AdminDirectory.Orgunits.list("my_customer", {domain:domain, type:"all"}).organizationUnits
  }
  var that = new Array()
  if (!searchFor){
    searchFor = "/Penalty Box"
  }
  for (i in OUs){
    var re = new RegExp(searchFor+"$")
    if (re.test(OUs[i].orgUnitPath,"i")){
      that.push(OUs[i])
    }
  }
  return that
}

function buildABox(){
  var RootOuId, PenaltyBox, PenaltyBoxOU, PenaltyBoxId = "", UserOuNames, reply
  RootOuId = AdminDirectory.Orgunits.list("my_customer", {domain:domain, type:"children"}).organizationUnits[0].parentOrgUnitId
  while(PenaltyBoxId === ""){
    if (PenaltyOUSheet.getRange("A2").getValue() != ""){
      PenaltyBoxId = PenaltyOUSheet.getRange("A2").getValue()
      break
    }
    Logger.log("No ID Defined - Checking for existing Penalty Box")
    PenaltyBox = getPenaltyBoxes(AdminDirectory.Orgunits.list("my_customer", {domain:domain, type:"children"}).organizationUnits)
    if (PenaltyBox.length == 1){
      PenaltyOUSheet.getRange("A2").setValue(PenaltyBox[0].orgUnitId)
      Logger.log(PenaltyBox[0].orgUnitId)
      PenaltyBoxId = PenaltyBox[0].orgUnitId
      break
    }
    //Do you want to create New OrgUnit named "PenaltyBox" (Yes) or use an existing Org Unit (No)?
    reply = "Yes" 
    if (reply == "Yes"){
      var resource = {name: "Penalty Box",
                      parentOrgUnitId: RootOuId,
                      description: "OU for users restricted for one reason or another -- Created by Zebra"}
      var PenaltyBoxOU = AdminDirectory.Orgunits.insert(resource, "my_customer")
      PenaltyOUSheet.getRange("A2").setValue(PenaltyBoxOU.orgUnitId)
      break
    }
    if (reply == "No"){
      //Choose and existing OU to use as a Penalty Box :
      PenaltyOUSheet.getRange("A2").setValue("/*OU ID*/")
      break
    }
  }
  //  Logger.log("Using OU with Name %s and ID %s",AdminDirectory.Orgunits.get("my_customer", [PenaltyBoxId]).name, PenaltyBoxId)
  var lastRow = PenaltyOUSheet.getLastRow()
  for (var j =2; j < lastRow; j++){
    var NewBox = getPenaltyBoxes(AdminDirectory.Orgunits.list("my_customer",
                                                              {domain:domain, type:"all"}).organizationUnits,
                                 PenaltyOUSheet.getRange("B"+j).getValues())
    try{
      PenaltyOUSheet.getRange("C"+j).setValue(NewBox[0].name)
      PenaltyOUSheet.getRange("D"+j).setValue(NewBox[0].orgUnitId)
    }
    catch(err){
      PenaltyOUSheet.getRange("C"+j).setValue("Error: Cannot find Org")
      updateAuditLog([new Date(), Session.getEffectiveUser(), err])}
  }
  createOU(PenaltyBoxId, PenaltyOUSheet)
  
  // internal functions  
  function createOU(ParentId, Sheet){
    var lastRow = Sheet.getLastRow();
    var boxes = getPenaltyBoxes();
    var children = [];
    for (i in boxes){
      var child = boxes[i];
      children.push(child)
    };
    var re = new RegExp(children.organizationUnits)
    //    check to see if OU exists.  If TRUE, copy the OrgUnitId to the PenaltyBox ID column; If FALSE, create new OrgUnit, the record;
    for(i=2; i < lastRow; i++){
      try{
        var value = Sheet.getRange("C"+i).getValue()
        Logger.log("%s : %s", value, re)
        //          check to see if OU exists.
        if (/Error|Penalty/i.test(value)){
          continue;}
        if (re.test(value)){
          Logger.log("%s Exists",value)
          Sheet.getRange("C"+i).setValue("/Penalty Box/"+value)
          continue;}
        else{
          var resource = {name: value,
                          description: "Penalty Box -- created by Zebra",
                          parentOrgUnitId: ParentId}
          var NewChild = AdminDirectory.Orgunits.insert(resource, 'my_customer')
          Sheet.getRange("E"+i).setValue(NewChild.orgUnitPath)            
          Sheet.getRange("F"+i).setValue(NewChild.orgUnitId)
        };}
      catch(err){updateAuditLog([new Date(), Session.getEffectiveUser(), "Error in Build-A-Box",err])}
    }}
}

function clearPenaltyBoxes(ParentID){
  if (!ParentID){
    ParentID =  PenaltyOUSheet.getRange("A2").getValue()
  }
  var children = AdminDirectory.Orgunits.list("my_customer", {
    domain: domain,
    orgUnitPath: ParentID,
  })
  for (i in children.organizationUnits){
    updateAuditLog([new Date(), Session.getEffectiveUser(),"Deleting "+children.organizationUnits[i].orgUnitPath,"Clear Penalty Box"])
    try{
      AdminDirectory.Orgunits.remove("my_customer", [children.organizationUnits[i].orgUnitId])
    }
    catch(err){updateAuditLog([new Date(),Session.getEffectiveUser(),"Error in Clearing Penalty Box - "+children.organizationUnits[i].orgUnitPath, err])}
  }
  PenaltyOUSheet.getRange("C2:G").clear()
}

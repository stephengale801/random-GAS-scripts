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
  var RootOuId, PenaltyBox, PenaltyBoxOU, PenaltyBoxId, UserOuNames, reply
  PenaltyBoxId = PenaltyOUSheet.getRange("A2").getValue()
  RootOuId = AdminDirectory.Orgunits.list("my_customer", {domain:domain, type:"children"}).organizationUnits[0].parentOrgUnitId
  if (PenaltyBoxId === ""){
    Logger.log("No ID Defined - What do you want to do")
    //prompt user if they want to have Zebra bulid a Penalty Box.
    reply = "Yes"
    //create PenaltyBox at Root Level with sub OUs for each Org Unit contining Users:
    if (reply == "Yes"){
      var resource = {name: "Penalty Box",
                      parentOrgUnitId: RootOuId,
                      description: "OU for users suspended for one reason or another -- Created by Zebra"}
      var PenaltyBoxOU = AdminDirectory.Orgunits.insert(resource, "my_customer")
      PenaltyOUSheet.getRange("A2").setValue(PenaltyBoxOU.orgUnitId)
    }
  }
  else{
    Logger.log("Using OU with Name %s and ID %s",AdminDirectory.Orgunits.get("my_customer", [PenaltyBoxId]).name, PenaltyBoxId)
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
        Logger.log(err)}
    }
  }
  createOU(PenaltyBoxId,PenaltyOUSheet)
  
  
  function createOU(ParentId, Sheet){
    var lastRow = Sheet.getLastRow();
    for(i=2; i < lastRow; i++){
      try{
        var value = Sheet.getRange("E"+i).getValue()
        if (value === ''){
          var name =  Sheet.getRange("C"+i).getValue()
          if (/Error/i.test(name)){
            continue
          }
          else{
            var resource = {name: name,
                            description: "Penalty Box -- created by Zebra",
                            parentOrgUnitId: ParentId}
            var NewChild = AdminDirectory.Orgunits.insert(resource, 'my_customer')
            Sheet.getRange("E"+i).setValue(NewChild.orgUnitId)
          }
        }
      }
      catch(err){Logger.log(err)}
    }
  }
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
    Logger.log("Deleting %s",children.organizationUnits[i].orgUnitPath)
    try{
      AdminDirectory.Orgunits.remove("my_customer", [children.organizationUnits[i].orgUnitId])
      Logger.log("Success!")
    }
    catch(err){Logger.log(err)}
  }
  PenaltyOUSheet.getRange("C2:E").clear()
}

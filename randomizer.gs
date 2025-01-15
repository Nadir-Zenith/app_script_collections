function onOpen(){
  var SS = SpreadsheetApp.getActiveSpreadsheet();
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Topic Randomizer')
  .addItem('Randomly select topic', 'randomizeTopics')
  .addToUi();
}

function randomizeTopics() {
  var refSheetName = Browser.inputBox('Enter reference sheet', Browser.OK_CANCEL);
  if (refSheetName === "") {
    Browser.msgBox('Invalid reference sheet');
    return;
  }

  var SS = SpreadsheetApp.getActiveSpreadsheet();
  var refSheet = SS.getSheetByName(refSheetName);
  if (!refSheet){
    refSheet = SS.getActiveSheet();
  }
  var sheetName = 'daily_topics_log';
  
  var sheet = SS.getSheetByName(sheetName);

  if (!sheet) {
    sheet = SS.insertSheet(sheetName);
    var header = ['Date','Topic', 'Domain'];
    sheet.appendRow(header)
  }

  var topics = refSheet.getDataRange().getValues()
  var topicsWithoutHeader = topics.slice(1);

  var randomIndex = Math.floor(Math.random() * topicsWithoutHeader.length);
  var randomRow = topicsWithoutHeader[randomIndex]
  
  Logger.log(randomRow)
  
  if (!randomRow){
    Browser.msgBox("Congratulations!!! All topics covered!\n Try another list of topics!!!");
    return;
  }
  else {
    var today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(),"yyyy-MM-dd"); 
    randomRow.unshift(today);
    sheet.appendRow(randomRow);
    refSheet.deleteRow(randomIndex + 2);
  }
}
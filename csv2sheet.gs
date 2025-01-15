function onOpen(){
  var SS = SpreadsheetApp.getActiveSpreadsheet();
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('CSV Importer')
  .addItem('Import CSVs', 'importCsvIfNoSheet')
  .addToUi();
}

function importCsvIfNoSheet() {
  var folderId = Browser.inputBox('Enter CSV floder ID', Browser.Buttons.OK_CANCEL);
  if (folderId === ""){
    Browser.msgBox('Invalid Folder ID');
    return;
  } 

  var sourceFolder = DriveApp.getFolderById(folderId);
  var files = sourceFolder.getFilesByType(MimeType.CSV)

  var spreadSheet = SpreadsheetApp.getActiveSpreadsheet();

  while (files.hasNext()){
    var file = files.next();
    var fileName = file.getName();

    var sheetName = fileName.replace(/\.csv$/i,'');
    var sheet = spreadSheet.getSheetByName(sheetName);

    if (!sheet){
      var csvData = Utilities.parseCsv(file.getBlob().getDataAsString());

      sheet = spreadSheet.insertSheet(sheetName)

      sheet.getRange(1,1, csvData.length, csvData[0].length).setValues(csvData);
    }
  }
}
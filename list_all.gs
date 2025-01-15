var filterText = '';
var data = [];

function onOpen() {
  var SS = SpreadsheetApp.getActiveSpreadsheet();
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('List Files/Folders')
    .addItem('List All Files', 'defaultList')
    .addItem('List Assignments', 'assignmentFunc')
    .addItem('List Notebooks ', 'notebookFunc')
    .addItem('List Images', 'imagesFunc')
    .addItem('List Programming','programmingFunc')
    .addItem ('List Quizzes', 'quizFunc')
    .addToUi();
};

function quizFunc(){
  filterText = 'Quiz';
  listFilesAndFolders();
}
function defaultList(){
  filterText = 'All';
  listFilesAndFolders();
};

function assignmentFunc(){
  filterText = 'Assignments';
  listFilesAndFolders();
};

function imagesFunc(){
    filterText = 'Images';
    listFilesAndFolders();
};

function notebookFunc(){
    filterText = 'Notebooks';
  listFilesAndFolders();
};

function programmingFunc(){
  filterText = 'Programmings';
  listFilesAndFolders();
};

function listFilesAndFolders(){
  var folderId = Browser.inputBox('Enter folder ID', Browser.Buttons.OK_CANCEL);
  if (folderId === "") {
    Browser.msgBox('Folder ID is invalid');
    return;
  }
  getFolderTree(folderId, true); 
};

// Get Folder Tree
function getFolderTree(folderId, listAll) {
  try {
    // Get folder by id
    var parentFolder = DriveApp.getFolderById(folderId);
    Logger.log(parentFolder.getName())
    // Initialise the sheet
    var sheet = SpreadsheetApp.getActiveSheet();
    var sheetName =  parentFolder.getName() + filterText;
    sheet.setName(sheetName);
    sheet.clear();
    sheet.appendRow(["Name","ID" ,"Date", "URL", "Last Updated", "Description", "Folder","Owner Email"]);

    // Get files and folders
    
    var files = parentFolder.getFiles()
    while( files.hasNext()){
        var childFile = files.next();
        checkFilter(childFile,sheet);
    }
    
    getChildFolders(parentFolder.getName(), parentFolder, data, sheet, listAll);
  } catch (e) {
    var ui = SpreadsheetApp.getUi();
    //ui.alert(sheetName + " Sheet already exists!!!")
    ui.alert(e.toString());
    Logger.log(e.toString());
  }
};

// Get the list of files and folders and their metadata in recursive mode
function getChildFolders(parentName, parent, data, sheet, listAll) {
  var childFolders = parent.getFolders();
 
  // List folders inside the folder
  while (childFolders.hasNext()) {
    var childFolder = childFolders.next();
 
    // List files inside the folder
    var files = childFolder.getFiles();
    while (listAll & files.hasNext()) {
      var childFile = files.next();
    
      checkFilter(childFile,sheet)

      // Write
     
    }

    // Recursive call of the subfolder
    getChildFolders(parentName + "/" + childFolder.getName(), childFolder, data, sheet, listAll);  
  }
};


function checkFilter(childFile,sheet){
  var name = childFile.getName();
   switch(filterText){

        case "Assignments":
            const assignmentRe = /(A|a)ssignment/;
            if (assignmentRe.test(name)){
              data = getData(childFile)
               sheet.appendRow(data);
            };
            break;
        
        case "Notebooks":
            const nbRe = /ipynb/;
            if (nbRe.test(name)){
              data = getData(childFile);
               sheet.appendRow(data);
            };
            break;
          
        case "Programmings":
            const progRe = /(P|p)rogramming/;
            if (progRe.test(name)){
              data = getData(childFile);
               sheet.appendRow(data);
            };
            break;
        case "Quiz":
            const quizRe = /(Q|q)uiz/;
            if (quizRe.test(name)){
              data = getData(childFile);
               sheet.appendRow(data);
            };
            break;
        case "Images":
            var mimetype = childFile.getMimeType()
            const imageTypes =['image/png', 'image/jpeg', 'image/gif','application/vnd.google-apps.drawing', 'image/webp', 'image/svg+xml']
            if (imageTypes.includes(mimetype) ){
              data = getData(childFile);
               sheet.appendRow(data);
            };
            break;
        default:
          data = getData(childFile);
          sheet.appendRow(data);
      }   
};

function getData(childFile){
  return [ 
        childFile.getName(),
        childFile.getId(),
        childFile.getDateCreated(),
        childFile.getUrl(),
        childFile.getLastUpdated(),
        childFile.getMimeType(),
        childFile.getParents().next().getName(),
        // childFile.getSize()/1024,
        //childFile.getOwner().getEmail(), 
      ];
};

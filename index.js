const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('fs');
const path = require('path');

let mainWindow;

const getAllJsonFiles = (dirPath, arrayOfFiles = []) => {
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
        if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
            arrayOfFiles = getAllJsonFiles(path.join(dirPath, file), arrayOfFiles);
        } else {
            if (path.extname(file) === '.json') {
                arrayOfFiles.push(path.join(dirPath, file));
            }
        }
    });

    return arrayOfFiles;
};

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    
    mainWindow.loadFile('index.html');
    mainWindow.webContents.openDevTools();
}

app.whenReady().then(createWindow);

ipcMain.on('open-folder-dialog', (event) => {
    dialog.showOpenDialog({
        properties: ['openDirectory']
    }).then(result => {
        if (!result.canceled && result.filePaths.length > 0) {
            const jsonFiles = getAllJsonFiles(result.filePaths[0]);
            event.sender.send('json-files-data', jsonFiles);
        }
    }).catch(err => {
        console.log(err);
    });
});

ipcMain.on('request-match-files', (event, matchIdentifier) => {
  const directoryPath = '/path/to/your/files'; // Set the directory path appropriately
  fs.readdir(directoryPath, (err, files) => {
      if (err) {
          console.log('Error reading files:', err);
          event.reply('match-files-response', []);
          return;
      }

      // Filter and group files based on the sixth character
      const groupedFiles = files.reduce((acc, filename) => {
          const baseName = path.basename(filename);
          if (baseName[5] === matchIdentifier) { // Check if the sixth character matches
              const ext = path.extname(filename);
              if (ext === '.json') {
                  acc.json = path.join(directoryPath, filename);
              } else if (ext === '.png') {
                  acc.png = path.join(directoryPath, filename);
              }
          }
          return acc;
      }, {json: '', png: ''});

      event.reply('match-files-response', groupedFiles);
  });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

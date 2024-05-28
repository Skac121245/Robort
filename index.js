const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { updateElectronApp } = require('update-electron-app')
const fs = require('fs');
const path = require('path');
updateElectronApp()

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

const createWindow = () => {
  const appVersion = require('./package.json').version;
    const win = new BrowserWindow({
      width: 2000,
      height: 1775,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: false, // It's often recommended to keep contextIsolation enabled for security purposes, but it requires additional setup to expose APIs to the renderer.
        devTools: false
      }
    })
  
    win.loadFile('index.html')

    win.setMenuBarVisibility(false);

    win.webContents.on('did-finish-load', () => {
      let name = require(`./package.json`).name;
      let version = require(`./package.json`).version;
      let windowTitle = name + " - v" + version;
      win.setTitle(windowTitle);
})

  }

  app.whenReady().then(() => {
    createWindow()
  })
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

console.log("what up dawg")


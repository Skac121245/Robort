const { app, BrowserWindow, ipcMain, dialog  } = require('electron')
const fs = require('fs');
const path = require('path');
const { updateElectronApp } = require('update-electron-app')
updateElectronApp()

let folderPath = null;


const createWindow = () => {
  const appVersion = require('./package.json').version;
    const win = new BrowserWindow({
      width: 2000,
      height: 1775,
      webPreferences: {
        nodeIntegration: true,
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
            currentFolderPath = result.filePaths[0];
            sendFolderContents(event, currentFolderPath);
        }
    }).catch(err => {
        console.log(err);
    });
});

ipcMain.on('navigate-folder', (event, folderPath, file) => {
  const newPath = path.join(folderPath, file);
  fs.stat(newPath, (err, stats) => {
      if (err) {
          console.log('Error accessing path:', err);
          return;
      }
      if (stats.isDirectory()) {
          currentFolderPath = newPath;
          sendFolderContents(event, newPath);
      } else {
          fs.readFile(newPath, 'utf8', (err, data) => {
              if (err) {
                  event.sender.send('file-content', 'Error reading file: ' + err.message);
              } else {
                  event.sender.send('file-content', data);
              }
          });
      }
  });
});

ipcMain.on('read-file', (event, fileName) => {
  if (folderPath && fileName) {
      const filePath = path.join(folderPath, fileName);
      fs.readFile(filePath, 'utf8', (err, data) => {
          if (err) {
              console.log('Error reading file:', err);
              event.sender.send('file-content', 'Error reading file: ' + err.message);
          } else {
              event.sender.send('file-content', data);
          }
      });
  } else {
      event.sender.send('file-content', 'Folder path or file name is missing.');
  }
});

function sendFolderContents(event, folderPath) {
  const files = fs.readdirSync(folderPath);
  event.sender.send('folder-data', files, folderPath);
}

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

console.log("what up dawg")


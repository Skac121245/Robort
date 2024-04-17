const { app, BrowserWindow } = require('electron')
const { updateElectronApp } = require('update-electron-app')
updateElectronApp()


const createWindow = () => {
  const appVersion = require('./package.json').version;
    const win = new BrowserWindow({
      width: 2000,
      height: 1775,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false, // It's often recommended to keep contextIsolation enabled for security purposes, but it requires additional setup to expose APIs to the renderer.
        devTools: true
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

console.log("what up dawg")


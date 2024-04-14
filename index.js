const { app, BrowserWindow } = require('electron')
const { updateElectronApp } = require('update-electron-app')
updateElectronApp()

const createWindow = () => {
  const appVersion = require('./package.json').version;
    const win = new BrowserWindow({
      width: 2000,
      height: 1775,
      title: "Robort - v${appVersion}",
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false, // It's often recommended to keep contextIsolation enabled for security purposes, but it requires additional setup to expose APIs to the renderer.
        devTools: false
      }
    })
  
    win.loadFile('index.html')

    win.setMenuBarVisibility(false);
  }

  app.whenReady().then(() => {
    createWindow()
  })

console.log("what up dawg")


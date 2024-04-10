const { app, BrowserWindow, ipcMain } = require("electron");
const { setdbPath } = require("sqlite-electron");

const { join } = require("path");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 2000,
    height: 1775,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true, // It's often recommended to keep contextIsolation enabled for security purposes, but it requires additional setup to expose APIs to the renderer.
      devTools: true,
      preload: join(__dirname, "preload.js"),
    },
  });

  win.loadFile("index.html");

  win.setMenuBarVisibility(true);
};

app.on("ready", function () {});

app.whenReady().then(() => {
  createWindow();
});

ipcMain.handle("potd", async (event, dbPath, isuri) => {
  try {
    return await setdbPath(dbPath, isuri);
  } catch (error) {
    console.log(error);
    return error;
  }
});

console.log("what up dawg");

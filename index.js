const { app, BrowserWindow, ipcMain, dialog } = require("electron/main");
const sqlite = require("sqlite-electron");
const { join } = require("path");

const randomWords = [
  "kwarqs",
  "Ben",
  "Toba",
  "duck",
  "robots",
  "spot",
  "lamp",
  "table",
  "tv",
];

const createWindow = () => {
  const win = new BrowserWindow({
    width: 2000,
    height: 1775,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true, // It's often recommended to keep contextIsolation enabled for security purposes, but it requires additional setup to expose APIs to the renderer.
      devTools: true,
      // this preload line is like importing your API definitions.
      preload: join(__dirname, "./sqliteDemo/preload.js"),
    },
  });

  win.loadFile("index.html");

  win.setMenuBarVisibility(false);
};

// This is responsible for showing the file dialog and letting you pick a file.
async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog();
  if (!canceled) {
    return filePaths[0];
  }
}

app.whenReady().then(() => {
  createWindow();
});

// This is where you define your back end handlers (what you'll call in preload.js)).
ipcMain.handle("dialog:openFile", handleFileOpen);

ipcMain.handle("databasePath", async (_event, dbPath) => {
  return (async () => {
    try {
      // Connect
      await sqlite.setdbPath(`file:${dbPath}?mode:rw`, true);
      await sqlite.executeQuery(
        "CREATE TABLE IF NOT EXISTS randomWords (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, word TEXT);"
      );
      return "Successfully connected to database!";
    } catch (err) {
      console.log(err);
    }
  })();
});

ipcMain.handle("add-random", async (_event) => {
  try {
    const randomInt = Math.floor(Math.random() * randomWords.length);
    const ret = await sqlite.executeQuery(
      `INSERT INTO randomWords (word) VALUES ("${randomWords[randomInt]}");`
    );
    return ret;
  } catch (error) {
    console.log(error);
    return error;
  }
});

ipcMain.handle("clear-db", async (_event) => {
  try {
    return await sqlite.executeQuery(`DELETE FROM randomWords;`);
  } catch (error) {
    console.log(error);
    return error;
  }
});

ipcMain.handle("get-data", async (_event) => {
  try {
    return await sqlite.fetchAll(`SELECT * FROM randomWords;`);
  } catch (error) {
    console.log(error);
    return error;
  }
});

console.log("what up dawg");

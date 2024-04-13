/*
This file is loaded before the webpage is shown to the user. It is
responsible for linking stuff that happens in the browser (usually user interactions)
with stuff that happens on the back end (usually calculations or database/file system logic).
It also describes *how* that interaction happens - what the endpoints are called,
what data they take, etc.

*/
const { contextBridge, ipcRenderer } = require("electron/renderer");

// Responsible for interacting with files.
contextBridge.exposeInMainWorld("fileApi", {
  openFile: () => ipcRenderer.invoke("dialog:openFile"),
});

// Responsible for connecting to the database.
contextBridge.exposeInMainWorld("sqliteApi", {
  path: async (path) => {
    // This part exposes an endpoint called "path" to the browser.
    // When you call it from the browser, it takes in a path that it gets from the open-file window,
    // then sends that to a function called "databasePath", which is defined back in index.js, and
    // does the actual connection to the database.
    // If that's successful, it shows the path. If not, it shows an error.
    try {
      const result = await ipcRenderer.invoke("databasePath", path);
      document.getElementById("output").innerText = "Output: " + result;
    } catch (error) {
      document.getElementById("output").innerText = "Output: " + error;
    }
  },
  add: async () => {
    // Similar to above, but calls "add-random"
    try {
      await ipcRenderer.invoke("add-random");
    } catch (error) {
      document.getElementById("output").innerText = "Output: " + error;
    }
  },
  clear: async () => {
    // Similar to above, but calls "clear-db"
    try {
      await ipcRenderer.invoke("clear-db");
    } catch (error) {
      document.getElementById("output").innerText = "Output: " + error;
    }
  },
  getData: async () => {
    try {
      return await ipcRenderer.invoke("get-data");
    } catch (error) {
      document.getElementById("output").innerText = "Output: " + error;
    }
  },
});
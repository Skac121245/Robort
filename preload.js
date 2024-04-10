const { contextBridge, ipcRenderer } = require("electron");

window.addEventListener("DOMContentLoaded", async () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const type of ["chrome", "node", "electron"]) {
    replaceText(`${type}-version`, process.versions[type]);
  }
});

contextBridge.exposeInMainWorld("api", {
  path: async () => {
    const path = document.getElementById("dbpath").value;
    try {
      const res = await ipcRenderer.invoke("potd", path);
      document.getElementById("pout").innerText = "Output: " + res;
    } catch (error) {
      document.getElementById("pout").innerText = "Output: " + error;
    }
  },
});

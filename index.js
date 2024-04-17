const { app, BrowserWindow, ipcMain } = require('electron');
const axios = require('axios');
const { updateElectronApp } = require('update-electron-app');

// Function to fetch the latest release notes from GitHub
async function fetchLatestReleaseNotes() {
  try {
    const repoName = 'Robort'; // Replace with your actual repo name
    const userName = 'Skac121245'; // Replace with your GitHub username
    const response = await axios.get(`https://api.github.com/repos/${userName}/${repoName}/releases/latest`);
    return response.data.body; // This contains the markdown content of the release notes
  } catch (error) {
    console.error('Failed to fetch release notes:', error);
    return null;
  }
}

const createWindow = async () => {
  const win = new BrowserWindow({
    width: 2000,
    height: 1775,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // It's recommended to keep contextIsolation enabled for security purposes, but it requires additional setup.
    }
  });

  win.loadFile('index.html');
  win.setMenuBarVisibility(false);

  win.webContents.on('did-finish-load', async () => {
    const name = require('./package.json').name;
    const version = require('./package.json').version;
    const windowTitle = `${name} - v${version}`;
    win.setTitle(windowTitle);

    // Fetch the release notes and send them to the renderer process
    const releaseNotes = await fetchLatestReleaseNotes();
    win.webContents.send('update_notification', releaseNotes);
  });
};

app.whenReady().then(() => {
  createWindow();
  updateElectronApp({
    repo: 'Skac121245/Robort',
    notifyUser: true
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

console.log("what up dawg");

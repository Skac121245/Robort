const { ipcRenderer } = require('electron');

document.getElementById('openFolder').addEventListener('click', () => {
    ipcRenderer.send('open-folder-dialog');
});

ipcRenderer.on('folder-data', (event, files, folderPath) => {
    const fileButtons = document.getElementById('fileButtons');
    fileButtons.innerHTML = ''; // Clear existing buttons
    files.forEach(file => {
        const button = document.createElement('button');
        button.textContent = file;
        button.addEventListener('click', () => {
            ipcRenderer.send('navigate-folder', folderPath, file);
        });
        fileButtons.appendChild(button);
    });

    // Update the folder path display
    document.getElementById('folderPathDisplay').textContent = folderPath;
});

ipcRenderer.on('file-content', (event, content) => {
    const fileContentArea = document.getElementById('fileContent');
    fileContentArea.value = content;
});

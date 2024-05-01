const { ipcRenderer } = require('electron');

document.getElementById('openFolder').addEventListener('click', () => {
    ipcRenderer.send('open-folder-dialog');
});

ipcRenderer.on('json-files-data', (event, files) => {
    const displayArea = document.getElementById('fileDisplayArea');
    displayArea.innerHTML = ''; // Clear existing content before adding new
    console.log(files)

    files.forEach(file => {
        const section = document.createElement('section');
        const objectElement = document.createElement('object');
        objectElement.type = 'text/html';
        objectElement.data = `dataBaseTeamPage.html?file=${encodeURIComponent(file)}`;
        objectElement.style.width = '100%';
        objectElement.style.height = '2000px'; // Adjust size as needed
        section.appendChild(objectElement);
        displayArea.appendChild(section);
    });
});

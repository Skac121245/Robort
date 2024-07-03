const { ipcRenderer } = require('electron');

document.getElementById('openFolder').addEventListener('click', () => {
    ipcRenderer.send('open-folder-dialog');
});

function loadMatchFiles(matchIdentifier) {
    ipcRenderer.send('request-match-files', matchIdentifier);
}

ipcRenderer.on('match-files-response', (event, files) => {
    displayMatchFiles(files);
});

ipcRenderer.on('change-background', (event, imagePath) => {
    document.getElementById("field_image_auto").style.backgroundImage = `url('${imagePath}')`;
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

function displayMatchFiles(files) {
    files.forEach(file => {
        const jsonPath = file.json;
        const pngPath = file.png;

        fs.access(pngPath, fs.constants.F_OK, (err) => {
            if (err) {
                console.log(`PNG file does not exist: ${pngPath}, notifying main process.`);
                ipcRenderer.send('update-background', '/images/crescendo_feild.png');
            }
        });
    });
}

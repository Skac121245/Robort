
/*
In this file, you can talk to stuff that's in the browser, like buttons and
input fields. When you get input, you can send it to the back end via the window.<blah> functions.
*/

const openFileButton = document.getElementById("open-file-button");
const filePathElement = document.getElementById("filePath");
const connectDbButton = document.getElementById("connect-db");
const addRecordButton = document.getElementById("add-record");
const clearDbButton = document.getElementById("clear-db");

function removeAllChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}
const resultsContainer = document.getElementById("table-container");

// find db file.
// This calls a function inside "preload.js" called openFile.
openFileButton.addEventListener("click", async () => {
  const filePath = await window.fileApi.openFile();
  filePathElement.innerText = filePath;
  await window.sqliteApi.path(filePathElement.innerText);
  reMakeTable();
});

// create db connection
connectDbButton.addEventListener("click", async () => {
  await window.sqliteApi.path(filePathElement.innerText);
});

// Add listener to add button
addRecordButton.addEventListener("click", async () => {
  await window.sqliteApi.add();
  await reMakeTable();
});

// Add listener to clear button
clearDbButton.addEventListener("click", async () => {
  await window.sqliteApi.clear();
  await reMakeTable();
});

// helper function for below
function removeAllChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

// Show results from database, polling every 1000ms
window.addEventListener("onDOMContentLoaded", () => {});

async function reMakeTable() {
  const data = await window.sqliteApi.getData();
  const table = document.createElement("table");
  table.style.width = "100%";
  table.setAttribute("border", "1");

  // Make the header row
  const headerRow = table.insertRow();
  const headers = ["id", "Random Word"];
  headers.forEach((headerText) => {
    const headerCell = document.createElement("th");
    headerCell.textContent = headerText;
    headerRow.appendChild(headerCell);
  });

  // Create a row for each word
  data.forEach((datum) => {
    const row = table.insertRow();
    Object.values(datum).forEach((text) => {
      const cell = row.insertCell();
      cell.textContent = text;
    });
  });

  // remove and recreate the table
  removeAllChildren(resultsContainer);
  resultsContainer.appendChild(table);
}

import FirestoreConnection from "./firestoreConnection.js";

//TODO: move to environment file
const firebaseConfig = {
  apiKey: "AIzaSyAIFfbuNCBl8Cr-8Y7Ur0TCh4foMnF-pqA",
  authDomain: "robort-demo.firebaseapp.com",
  projectId: "robort-demo",
  storageBucket: "robort-demo.firebasestorage.app",
  messagingSenderId: "125478266135",
  appId: "1:125478266135:web:e74fc8ef40adc41d360352",
};

const nouns = [
  "Fireflies",
  "Juggernauts",
  "Gearheads",
  "Superheroes",
  "Wizards",
];
const adjectives = ["Metal", "Cosmic", "Iron", "Imaginary", "Absurd"];

const firestoreConnection = new FirestoreConnection();
firestoreConnection.initialize(firebaseConfig);

function onNewScoutingData(results) {
  let resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = results.map((r) => {
    return `<tr>
    <td>${r.data.teamName}</td>
    <td>${r.data.canClimb}</td>
    <td>${r.data.canScoreL0}</td>
    <td>${r.data.canScoreL1}</td>
    <td>${r.data.canScoreL2}</td>
    <td>${r.data.canScoreL3}</td>
    </tr>`;
  });
}

function onNewImageData(results) {
  let imageContainer = document.getElementById("image-results");
  imageContainer.innerHTML = "";

  results.forEach((r) => {
    let teamContainer = document.createElement("div");
    teamContainer.innerHTML = `<b>
        Team ${r.id} at ${r.data.eventCode}
      </b>`;
    console.log(JSON.stringify(r));
    r.data.paths.forEach((p) => {
      let img = document.createElement("img");
      img.src = p;
      img.style.maxWidth = "300px";
      img.alt = "match num " + r.data.matchNum;
      teamContainer.appendChild(img);
    });
    imageContainer.appendChild(teamContainer);
  });
}

function generateRandomTeam() {
  return {
    teamName: `The ${
      adjectives[Math.floor(Math.random() * adjectives.length)]
    } ${nouns[Math.floor(Math.random() * nouns.length)]}`,
    canClimb: Math.random() < 0.5,
    canScoreL0: Math.random() < 0.5,
    canScoreL1: Math.random() < 0.5,
    canScoreL2: Math.random() < 0.5,
    canScoreL3: Math.random() < 0.5,
  };
}

function addRandomTeam() {
  const t = generateRandomTeam();
  firestoreConnection.addData("scouting-data", t);
}

document
  .getElementById("image-uploader")
  .addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        firestoreConnection.addData(
          "path-data",
          {
            matchNum: Math.floor(Math.random() * 100), // Make up match num
            eventCode: "greater-boston", // eventually fill in with real code
            paths: [reader.result],
          },
          Math.floor(Math.random() * 10000).toString() // Make up team num
        );
      };
      reader.readAsDataURL(file);
    }
  });

firestoreConnection.pollCollection("scouting-data", onNewScoutingData);
firestoreConnection.pollCollection("path-data", onNewImageData);

window.addRandomTeam = addRandomTeam;
window.clearTeams = clearTeams;
window.uploadImage = uploadImage;

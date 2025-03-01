import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";

export default class FirestoreConnection {
  constructor() {
    this.db = null;
    this.isConnected = false;
    this.unsubscribes = [];
    this.initialize.bind(this);
    this.addData.bind(this);
    this.disconnect.bind(this);
  }

  // Initialize Firestore connection with credentials
  initialize(config) {
    if (!this.isConnected) {
      const app = initializeApp(config, { persistentLocalCache: {} });
      this.db = getFirestore(app);

      this.isConnected = true;
    } else {
      console.log("Already connected to Firestore");
    }
  }

  // Disconnect from Firestore
  disconnect() {
    if (this.isConnected) {
      this.firebase
        .app()
        .delete()
        .then(() => {
          this.isConnected = false;
          console.log("Disconnected from Firestore.");
        })
        .catch((error) => {
          console.error("Error disconnecting from Firestore: ", error);
        });
    } else {
      console.log("Already disconnected from Firestore.");
    }
  }

  // Poll a Firestore collection for changes
  pollCollection(collectionName, callback, interval = 1000) {
    if (!this.isConnected) {
      console.log("Not connected to Firestore!");
      return;
    }
    const colRef = collection(this.db, collectionName); // Access the collection reference

    // Create a polling function
    const poll = () => {
      getDocs(colRef) // Fetch documents from the collection
        .then((snapshot) => {
          const data = snapshot.docs.map((doc) => {
            return { id: doc.id, data: doc.data() };
          });
          callback(data);
        })
        .catch((error) => {
          console.error("Error polling Firestore collection: ", error);
        });
    };

    poll();
    const intervalId = setInterval(poll, interval);
    this.unsubscribes.push(() => clearInterval(intervalId));
  }

  stopPolling() {
    this.unsubscribes.forEach((unsubscribe) => unsubscribe());
    this.unsubscribes = [];
  }

  async addData(collectionName, data, docId) {
    if (docId) {
      const docRef = doc(this.db, collectionName, docId);
      return await setDoc(docRef, data);
    } else {
      return await addDoc(collection(this.db, collectionName), data); // addDoc auto-generates an ID
    }
  }
}


// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyB_MPkLje_RSxLZjvS45-SpqFqLLK24rSk",
    authDomain: "portfolio-tracker-edd8c.firebaseapp.com",
    projectId: "portfolio-tracker-edd8c",
    storageBucket: "portfolio-tracker-edd8c.appspot.com",
    messagingSenderId: "364835395133",
    appId: "1:364835395133:web:93f2f57b6306f961303c54"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };

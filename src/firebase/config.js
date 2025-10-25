import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAffJoH8s5NTvLvYBOhMmuCn6MXMO3IVGI",
  authDomain: "via-kashmir.firebaseapp.com",
  projectId: "via-kashmir",
  storageBucket: "via-kashmir.firebasestorage.app",
  messagingSenderId: "786710416741",
  appId: "1:786710416741:web:420086aeff6dd771fc658c",
  measurementId: "G-TPPH3B30WR"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;

import { initializeApp } from "firebase/app";
import "firebase/auth";
 
const firebaseConfig = {
  apiKey: "AIzaSyDTNFsaNlmxOD-Rn2t_EDpycHP0u_AAFqk",
  authDomain: "quizify-5f97a.firebaseapp.com",
  projectId: "quizify-5f97a",
  storageBucket: "quizify-5f97a.appspot.com",
  messagingSenderId: "232995801741",
  appId: "1:232995801741:web:687306d1b1774f5601b0c4",
  measurementId: "G-TSX75Z5JPT"
};

const app = initializeApp(firebaseConfig);

export default app;

# Quizify 

Quizify is a software for trivia game. For everyone to crave out new knowledge. We use open trivai db api. You can check them out here https://opentdb.com. 


## Run Locally

Clone the project

```bash
  git clone https://github.com/kunzaka001/quizify.git
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```


## How to use

To use this project after yoou clone this repo you need to create file call "config.js" That will hold all your firebase credentials.

```typescript
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "........................",
  authDomain: "........................",
  databaseURL: "........................",
  projectId: "........................",
  storageBucket: "........................",
  messagingSenderId: "........................",
  appId: "........................",
  measurementId: "........................"
};


const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default app;

```


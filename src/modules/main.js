import { censorBadWords } from "./profanity.js";
import { addMessageToFirebase } from "./firebase.js";

let badWords = "damn!";

console.log(censorBadWords(badWords));

badWords = censorBadWords(badWords);

const user = "mehdi";

addMessageToFirebase(badWords, user);
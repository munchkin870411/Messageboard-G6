import { censorBadWords } from "./profanity.js";
import { addMessageToFirebase, fetchMessagesFromFirebase } from "./firebase.js";

const messageForm = document.querySelector("#messageForm");
messageForm.addEventListener('submit', event => {
    event.preventDefault();

  const formData = new FormData(event.target);
  const userName = formData.get('name'); 
  const userMessage = formData.get('message');

  addMessageToFirebase(userMessage, userName);

  event.target.reset();
})
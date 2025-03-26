import { addMessageToFirebase, fetchMessagesFromFirebase } from "./firebase.js";
import { displayMessages } from "./display.js";
import { censorBadWords } from "./profanity.js";

fetchMessagesFromFirebase().then(messagesArray => {
    displayMessages(messagesArray);
});

const messageForm = document.querySelector("#messageForm");
messageForm.addEventListener('submit', async event => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const userName = formData.get('name'); 
    const userMessage = censorBadWords(formData.get('message'));

    try {
        await addMessageToFirebase(userMessage, userName);
        const updatedMessages = await fetchMessagesFromFirebase();
        displayMessages(updatedMessages);

        event.target.reset();
    } catch (error) {
        console.error("Error adding message:", error);
    }
});
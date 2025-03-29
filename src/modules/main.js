import { fetchMessagesFromFirebase, addMessageToFirebase, deleteMessageFromFirebase, listenForMessageChanges } from "./newFirebase.js";
import { displayMessages } from "./display.js";
import { censorBadWords } from "./profanity.js";

fetchMessagesFromFirebase().then((messagesArray) => {
  displayMessages(messagesArray);
});

const messageForm = document.querySelector("#messageForm");
const colorButtons = document.querySelectorAll(".color-circle");
const colorInput = document.querySelector("#noteColor");

// Handle color selection
colorButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedColor = button.dataset.color;
    colorInput.value = selectedColor;
  });
});

// JavaScript to toggle the mobile menu
const hamburger = document.querySelector('.hamburger');
const mobileHeader = document.querySelector('.mobile-header');

hamburger.addEventListener('click', () => {
  mobileHeader.classList.toggle('active');
});

messageForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const userName = formData.get("name");
  const userMessage = censorBadWords(formData.get("message"));
  const selectedColor = formData.get("color") || "yellow";

  try {

  const messagesArray = await fetchMessagesFromFirebase();
    
  // Const for checking if the username exists and is banned
  const existingUser = messagesArray.find(msg => msg.user === userName);

  // I have added so that if the chosen username is banned the user won't be able to add any messages
  if (existingUser && existingUser.banned) {
    alert("This username is banned, try again.");
    return;
  }
  
  const audio = new Audio(new URL('/audio/pop-feature.mp3', import.meta.url).href);
  audio.play();

  try {
    await addMessageToFirebase(userMessage, userName, selectedColor);
    fetchMessagesFromFirebase((messagesArray) => {
      displayMessages(messagesArray);
    });

    event.target.reset();
    colorInput.value = "yellow";
  } catch (error) {
    console.error("Error adding message:", error);
  }
}
 catch (error) {
  console.error("Error adding message:", error);
}
});


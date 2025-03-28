import { addMessageToFirebase, fetchMessagesWithPolling } from "./firebase.js";
import { displayMessages } from "./display.js";
import { censorBadWords } from "./profanity.js";

fetchMessagesWithPolling((messagesArray) => {
    displayMessages(messagesArray);
});

const messageForm = document.querySelector("#messageForm");
const colorButtons = document.querySelectorAll(".color-circle");
const colorInput = document.getElementById("noteColor");

// Handle color selection
colorButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedColor = button.dataset.color;
    colorInput.value = selectedColor;
  });
});

messageForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const userName = formData.get("name");
  const userMessage = censorBadWords(formData.get("message"));
  const selectedColor = formData.get("color") || "yellow";

  var audio = new Audio('../audio/pop-feature.mp3');
  audio.play();

  try {
    await addMessageToFirebase(userMessage, userName, selectedColor);
    fetchMessagesWithPolling((messagesArray) => {
      displayMessages(messagesArray);


    });

    event.target.reset();
    colorInput.value = "yellow";
  } catch (error) {
    console.error("Error adding message:", error);
  }
});


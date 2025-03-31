import {
  fetchMessagesFromFirebase,
  addMessageToFirebase,
  deleteMessageFromFirebase,
  listenForMessageChanges,
} from "./newFirebase.js";
import { displayMessages } from "./display.js";
import { censorBadWords } from "./profanity.js";
import { initializeSearch, filterMessages } from "./search.js";

// Store all messages globally
let allMessages = [];

// Function to filter and display messages
function filterAndDisplayMessages(searchTerm = "") {
  const filteredMessages = filterMessages(allMessages, searchTerm);
  displayMessages(filteredMessages);
}

// Initialize message listener
listenForMessageChanges((messagesArray) => {
  allMessages = messagesArray;
  filterAndDisplayMessages(
    document.getElementById("searchInput")?.value.toLowerCase() || ""
  );
});

// Initialize search functionality
initializeSearch(filterAndDisplayMessages);

const messageForm = document.querySelector("#messageForm");
const colorButtons = document.querySelectorAll(".color-circle");
const colorInput = document.querySelector("#noteColor");

colorButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedColor = button.dataset.color;
    colorInput.value = selectedColor;
  });
});

const hamburger = document.querySelector(".hamburger");
const mobileHeader = document.querySelector(".mobile-header");

hamburger.addEventListener("click", () => {
  mobileHeader.classList.toggle("active");
});

messageForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const userName = formData.get("name");
  const userMessage = censorBadWords(formData.get("message"));
  const selectedColor = formData.get("color") || "yellow";

  try {
    const messagesArray = await fetchMessagesFromFirebase();

    const existingUser = messagesArray.find((msg) => msg.user === userName);
    if (existingUser && existingUser.banned) {
      alert("This username is banned, try again.");
      return;
    }

    const audio = new Audio(
      new URL("/audio/pop-feature.mp3", import.meta.url).href
    );
    audio.play();

    await addMessageToFirebase(userMessage, userName, selectedColor);

    event.target.reset();
    colorInput.value = "yellow";
  } catch (error) {
    console.error("Error adding message:", error);
  }
});

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
console.log("main.js loaded");

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

document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger");
  const mobileHeader = document.querySelector(".mobile-header");
  const mobileNav = document.querySelector(".mobile-nav");

  // Log to check if elements are selected
  console.log(hamburger, mobileNav);

  // Toggle the 'active' class on hamburger click to open/close the menu
  hamburger.addEventListener("click", () => {
    mobileHeader.classList.toggle("active");
    mobileNav.classList.toggle("active");
  });

  // Close the menu if the user clicks anywhere outside of it
  document.addEventListener("click", (event) => {
    if (
      !mobileHeader.contains(event.target) &&
      !hamburger.contains(event.target)
    ) {
      mobileNav.classList.remove("active");
      mobileHeader.classList.remove("active");
    }
  });
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

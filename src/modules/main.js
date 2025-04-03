import { fetchMessagesFromFirebase, addMessageToFirebase, deleteMessageFromFirebase, listenForMessageChanges, fetchBannedUsersFromFirebase } from "./newFirebase.js";
import { displayMessages, messageDate, current_date } from "./display.js";
import { censorBadWords } from "./profanity.js";
import { initializeSearch, updateMessages } from "./search.js";
import Fireworks from "fireworks-js";

console.log("main.js loaded");

// Listen for Firebase changes and update the search module
listenForMessageChanges((messagesArray) => {
  updateMessages(messagesArray);
});

const messageForm = document.querySelector("#messageForm");
const colorButtons = document.querySelectorAll(".color-circle");
const colorInput = document.querySelector("#noteColor");

colorButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedColor = button.dataset.color;
    colorInput.value = selectedColor;
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const mobileHeader = document.querySelector('.mobile-header');
  const mobileNav = document.querySelector('.mobile-nav');
  initializeSearch(displayMessages);


  // Log to check if elements are selected
  console.log(hamburger, mobileNav); 

  // Toggle the 'active' class on hamburger click to open/close the menu
  hamburger.addEventListener('click', () => {
    mobileHeader.classList.toggle('active');
    mobileNav.classList.toggle('active');
  });

  // Close the menu if the user clicks anywhere outside of it
  document.addEventListener('click', (event) => {
    if (!mobileHeader.contains(event.target) && !hamburger.contains(event.target)) {
      mobileNav.classList.remove('active');
      mobileHeader.classList.remove('active');
    }
  });
});
messageForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const userName = formData.get("name");
  const userMessage = censorBadWords(formData.get("message"));
  const selectedColor = formData.get("color") || "yellow";
  const messageDate = new Date(Date.now());
  //const currentDate = new Date(Date.now());

  console.log(messageDate);

  try {
   // const messagesArray = await fetchMessagesFromFirebase();
    
    //const existingUser = messagesArray.find(msg => msg.user === userName);
    //if (existingUser && existingUser.banned) {
    //  alert("This username is banned, try again.");
    //  return;
   // }

   
   const bannedUsers = await fetchBannedUsersFromFirebase();
    
   
   if (bannedUsers.some(user => user.user === userName)) {
     alert("This username is banned, try again.");
     return;
   }

    
    const audio = new Audio(new URL('/audio/pop-feature.mp3', import.meta.url).href);
    audio.play();

    const messageObj = await addMessageToFirebase(userMessage, userName, selectedColor, messageDate);
    
    // 🎆 Fireworks logic
    const container = document.getElementById("messages");

    const fireworksContainer = document.createElement("div");
    fireworksContainer.id = "fireworksContainer";
    Object.assign(fireworksContainer.style, {
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      zIndex: "9999",
    });
    container.appendChild(fireworksContainer);
    const fireworks = new Fireworks(fireworksContainer, {
      autoresize: true,
      opacity: 0.5,
      acceleration: 1.05,
      friction: 0.98,
      gravity: 1.5,
      particles: 150,
      trace: 3,
      explosion: 10,
      intensity: 50,
      flickering: 50,
      lineWidth: {
        trace: 2,
        explosion: 4,
      },
      brightness: {
        min: 50,
        max:  80,
        decay: { min: 0.015, max: 0.03 },
      },
      hue: { min: 0, max: 360 },
      delay: { min: 30, max: 60 },
    });

    fireworks.start();
    setTimeout(() => fireworks.stop(), 3000);

    event.target.reset();
    colorInput.value = "yellow";
  } catch (error) {
    console.error("Error adding message:", error);
  }
});


// Emoji Picker by Marcel 
function toggleEmojiPanel() {
  const panel = document.getElementById('emojiPanel');
  panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}

function addEmoji(emoji) {
  const input = document.getElementById('message');
  input.value += emoji;
  input.focus();
}

window.toggleEmojiPanel = toggleEmojiPanel;
window.addEmoji = addEmoji;


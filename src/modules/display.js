import {
  updateLikeDislikeFirebase,
  patchBanned,
  fetchMessagesFromFirebase,
} from "./newFirebase.js";

function getRotationFromId(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return (hash % 5) - 2; // Gives -5 to +4 degrees
}

export function displayMessages(messagesArray) {
  const messagesDiv = document.querySelector("#messages");
  const existingMessageIds = new Set(
    [...messagesDiv.children].map((msg) => msg.id)
  );

  for (let i = 0; i < messagesArray.length; i++) {
    const messageData = messagesArray[i];

    
    if (existingMessageIds.has(messageData.id)) continue;

    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", "postit");
    messageDiv.id = messageData.id;

    const rotation = getRotationFromId(messageData.id);
    messageDiv.style.transform = `rotate(${rotation}deg)`;

    if (messageData.color) {
      messageDiv.classList.add(messageData.color);
    }

    const user = document.createElement("h6");
    const message = document.createElement("h4");
    const likeButton = document.createElement("button");
    likeButton.classList.add("like-button");
    const dislikeButton = document.createElement("button");
    dislikeButton.classList.add("dislike-button");
    const likeCount = document.createElement("span");
    const dislikeCount = document.createElement("span");

    user.textContent = `${messageData.user}:`;
    message.textContent = messageData.message;

    likeButton.textContent = "👍 ";
    likeCount.textContent = messageData.like || 0;
    likeButton.appendChild(likeCount);

    dislikeButton.textContent = "👎 ";
    dislikeCount.textContent = messageData.dislike || 0;
    dislikeButton.appendChild(dislikeCount);

    likeButton.addEventListener("click", async () => {
      await updateLikeDislikeFirebase(messageData.id, "like");
      likeCount.textContent = parseInt(likeCount.textContent) + 1;
    });

    dislikeButton.addEventListener("click", async () => {
      await updateLikeDislikeFirebase(messageData.id, "dislike");
      dislikeCount.textContent = parseInt(dislikeCount.textContent) + 1;
    });

    messageDiv.append(user, message, likeButton, dislikeButton);
    messagesDiv.append(messageDiv);

   
    anime({
      targets: messageDiv,
      opacity: [0, 1],
      rotate: [-360, 0], 
      scale: [0.5, 1], 
      duration: 2000,    
      easing: "easeOutElastic(1, .6)",
    });
  }
}


document.getElementById("resetButton").addEventListener("click", async () => {
  const confirmation = confirm("Are you sure you want to reset all messages?");
  if (confirmation) {
    try {
      // Hämta alla meddelanden från Firebase
      const messages = await fetchMessagesFromFirebase();
      const deletePromises = messages.map((message) => {
        const messageURL = `https://messageboard-g6-default-rtdb.europe-west1.firebasedatabase.app/messages/${message.id}.json`;
        return fetch(messageURL, { method: "DELETE" });
      });

      // Vänta tills alla meddelanden är borttagna
      await Promise.all(deletePromises);
      console.log("All messages deleted.");

      // Uppdatera UI:t
      displayMessages([]); // Töm meddelandelistan i UI:t
    } catch (error) {
      console.error("Error resetting messages:", error);
    }
  }
});

import { updateLikeDislikeFirebase } from "./firebase.js";

function getRotationFromId(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return (hash % 5) - 2; // Gives -5 to +4 degrees
}

export function displayMessages(messagesArray) {
  const messagesDiv = document.querySelector("#messages");
  messagesDiv.innerHTML = "";

  for (let i = 0; i < messagesArray.length; i++) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", "postit");
    messageDiv.id = messagesArray[i].id;

    const rotation = getRotationFromId(messagesArray[i].id);
    messageDiv.style.transform = `rotate(${rotation}deg)`;

    if (messagesArray[i].color) {
      messageDiv.classList.add(messagesArray[i].color);
    }

    const user = document.createElement("h6");
    const message = document.createElement("h4");
    const likeButton = document.createElement("button");
    const dislikeButton = document.createElement("button");
    const likeCount = document.createElement("span");
    const dislikeCount = document.createElement("span");

    user.textContent = `User: ${messagesArray[i].user}`;
    message.textContent = messagesArray[i].message;

    likeButton.textContent = "👍 ";
    likeCount.textContent = messagesArray[i].like || 0;
    likeButton.appendChild(likeCount);

    dislikeButton.textContent = "👎 ";
    dislikeCount.textContent = messagesArray[i].dislike || 0;
    dislikeButton.appendChild(dislikeCount);

    likeButton.addEventListener("click", async () => {
      await updateLikeDislikeFirebase(messagesArray[i].id, "like");
      likeCount.textContent = parseInt(likeCount.textContent) + 1;
    });

    dislikeButton.addEventListener("click", async () => {
      await updateLikeDislikeFirebase(messagesArray[i].id, "dislike");
      dislikeCount.textContent = parseInt(dislikeCount.textContent) + 1;
    });

    messageDiv.append(user, message, likeButton, dislikeButton);
    messagesDiv.append(messageDiv);
  }
}

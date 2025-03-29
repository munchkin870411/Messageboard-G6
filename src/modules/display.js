import {
  updateLikeDislikeFirebase,
  patchBanned,
  fetchMessagesFromFirebase,
} from "./firebase.js";

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
    likeButton.classList.add("like-button");
    const dislikeButton = document.createElement("button");
    dislikeButton.classList.add("dislike-button");
    const likeCount = document.createElement("span");
    const dislikeCount = document.createElement("span");

    user.textContent = `${messagesArray[i].user}:`;
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

    // Kimiya's feature - I have added an event listener so you get the option to ban a username when clicking on their name
    // The styling of the button is a bit odd but maybe you can fix it it in the css file - I have given the button the className "ban-button"
    user.addEventListener("click", async (event) => {
      event.preventDefault();

      const firebaseID = messagesArray[i].id;

      document.querySelectorAll(".ban-button").forEach((btn) => btn.remove());

      if (!user.querySelector(".ban-button")) {
        const banButton = document.createElement("button");
        banButton.className = "ban-button";
        banButton.innerText = "Ban";
        messageDiv.append(banButton);

        banButton.addEventListener("click", async (event) => {
          event.preventDefault();
          const confirmBan = confirm("Do you want to ban this user?");
          if (confirmBan) {
            await patchBanned(firebaseID, true);
            const users = fetchMessagesFromFirebase();
            displayMessages(users);
          } else {
            const users = fetchMessagesFromFirebase();
            displayMessages(users);
          }
        });
      }
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

export function displayMessages(messagesArray) {
    console.log(messagesArray);

    const messagesDiv = document.querySelector('#messages');
    messagesDiv.innerHTML = '';

    for (let i = 0; i < messagesArray.length; i++) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add("message");

        const user = document.createElement('h6');
        const message = document.createElement('h4');
        const likeButton = document.createElement("button");
        const dislikeButton = document.createElement("button");
        const likeCount = document.createElement("span");
        const dislikeCount = document.createElement("span");

        user.textContent = `User: ${messagesArray[i].user}`;
        message.textContent = messagesArray[i].message;

       
        likeButton.textContent = "👍 ";
        likeCount.textContent = "0";
        likeButton.appendChild(likeCount);

      
        dislikeButton.textContent = "👎 ";
        dislikeCount.textContent = "0";
        dislikeButton.appendChild(dislikeCount);

       
        likeButton.addEventListener("click", () => {
            let count = parseInt(likeCount.textContent);
            likeCount.textContent = count + 1;
        });

       
        dislikeButton.addEventListener("click", () => {
            let count = parseInt(dislikeCount.textContent);
            dislikeCount.textContent = count + 1;
        });

       
        messageDiv.appendChild(user);
        messageDiv.appendChild(message);
        messageDiv.appendChild(likeButton);
        messageDiv.appendChild(dislikeButton);

       
        messagesDiv.appendChild(messageDiv);
    }
}

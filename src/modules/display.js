export function displayMessages(messagesArray) {
    console.log(messagesArray);

    const messagesDiv = document.querySelector('#messages');
    messagesDiv.innerHTML = '';

    for(let i = 0; i < messagesArray.length; i++) {
        const messageDiv = document.createElement('div');
        const user = document.createElement('h6');
        const message = document.createElement('h4');
      
        user.textContent = `User: ${messagesArray[i].user}`;
        message.textContent = messagesArray[i].message;
    
        messageDiv.appendChild(user);
        messageDiv.appendChild(message);
    
        messagesDiv.appendChild(messageDiv);
    }
};
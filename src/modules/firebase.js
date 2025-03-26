const URL = "https://messageboard-g6-default-rtdb.europe-west1.firebasedatabase.app/messages.json";

export function addMessageToFirebase(message, user) { 
    const messageData = {
      message: message,
      user: user
    };
  
    fetch(URL, {
      method: 'POST',
      body: JSON.stringify(messageData),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .catch(error => {
      console.error('Error adding message:', error);
    });
}

export function fetchMessagesFromFirebase() {
  fetch(URL)
    .then(response => response.json())
    .then(data => {
      if (data) {
        // Convert the object into an array (optional, but may be useful for easier handling)
        const messagesArray = Object.keys(data).map(key => ({
          id: key, 
          ...data[key]
        }));
      } 
    })
    .catch(error => {
      console.error('Error fetching messages:', error);
    });
}
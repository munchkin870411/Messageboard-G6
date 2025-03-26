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
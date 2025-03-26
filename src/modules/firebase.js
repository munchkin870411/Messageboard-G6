const URL = "https://messageboard-g6-default-rtdb.europe-west1.firebasedatabase.app/messages.json";

export async function addMessageToFirebase(message, user, like, dislike) {
    const messageData = {
        message: message,
        user: user,
        like: like,
        dislike: dislike,
      };

    const response = await fetch(URL, { 
        method: 'POST',
        body: JSON.stringify(messageData),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to add message');
    }

    return response.json();
}

export async function fetchMessagesFromFirebase() {
  try {
    const response = await fetch(URL);
    const data = await response.json();

    if (!data) {
        return [];
    };

    return Object.keys(data).map(key => ({
      id: key,
      ...data[key]
    }));

  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
}

export function fetchMessagesWithPolling(callback) {
    setInterval(async () => {
        try {
            const response = await fetch(URL);
            const data = await response.json();
            const messagesArray = data ? Object.values(data) : [];
            callback(messagesArray);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    }, 10000);
}
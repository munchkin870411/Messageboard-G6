const URL =
  "https://messageboard-g6-default-rtdb.europe-west1.firebasedatabase.app/messages.json";

export async function addMessageToFirebase(message, user) {
  const messageData = {
    message: message,
    user: user,
    like: 0,
    dislike: 0,
  };

  const response = await fetch(URL, {
    method: "POST",
    body: JSON.stringify(messageData),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to add message");
  }

  return response.json();
}

export async function fetchMessagesFromFirebase() {
  try {
    const response = await fetch(URL);
    const data = await response.json();

    if (!data) {
      return [];
    }

    return Object.keys(data).map((key) => ({
      id: key,
      ...data[key],
    }));
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
}

export async function updateLikeDislikeFirebase(messageId, type) {
  const messageURL = `https://messageboard-g6-default-rtdb.europe-west1.firebasedatabase.app/messages/${messageId}.json`;

  try {
    const response = await fetch(messageURL);
    const messageData = await response.json();

    if (!messageData) {
      throw new Error("Message not found");
    }

    const updatedData = {
      like: type === "like" ? messageData.like + 1 : messageData.like,
      dislike:
        type === "dislike" ? messageData.dislike + 1 : messageData.dislike,
    };

    await fetch(messageURL, {
      method: "PATCH",
      body: JSON.stringify(updatedData),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(`Error updating ${type}:`, error);
  }
}

export function fetchMessagesWithPolling(callback) {
  setInterval(async () => {
    try {
      const response = await fetch(URL);
      const data = await response.json();
      const messagesArray = data
        ? Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }))
        : [];
      callback(messagesArray);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, 1000);
}

export async function deleteMessageFromFirebase(messageId) {
  const messageURL = `https://messageboard-g6-default-rtdb.europe-west1.firebasedatabase.app/messages/${messageId}.json`;

  try {
    const response = await fetch(messageURL, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete message");
    }

    console.log(`Message with ID ${messageId} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting message:", error);
  }
}
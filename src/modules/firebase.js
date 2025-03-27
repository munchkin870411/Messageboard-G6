const URL = "https://messageboard-g6-default-rtdb.europe-west1.firebasedatabase.app/messages.json";

export async function addMessageToFirebase(message, user, color) {
  const messageData = {
    message,
    user,
    like: 0,
    dislike: 0,
    color,
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
  }, 10000);
}


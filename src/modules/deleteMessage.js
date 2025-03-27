const messageURL = `https://messageboard-g6-default-rtdb.europe-west1.firebasedatabase.app/messages/${messageId}.json`;

async function deleteMessageFromFirebase(messageId) {
    try {
        const response = await fetch(messageURL, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error("Failed to delete message");
        }
    } catch (error) {
        console.error("Error deleting message:", error);
    }
}

export function deleteMessage(messageId) {
    deleteMessageFromFirebase(messageId);
}
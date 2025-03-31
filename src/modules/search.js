/**
 * Search module for filtering messages by username and content (Linns feature)
 */
let allMessages = [];
let searchCallback = null;

export function initializeSearch(filterCallback) {
  searchCallback = filterCallback;

  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", handleSearchInput);
  }
}

export function updateMessages(messagesArray) {
  allMessages = messagesArray;

  const searchInput = document.getElementById("searchInput");
  const searchTerm = searchInput ? searchInput.value.toLowerCase() : "";
  performSearch(searchTerm);
}

function handleSearchInput(event) {
  const searchTerm = event.target.value.toLowerCase();
  performSearch(searchTerm);
}

export function performSearch(searchTerm = "") {
  const filteredMessages = filterMessages(allMessages, searchTerm);

  if (searchCallback) {
    searchCallback(filteredMessages);
  }
}

export function filterMessages(messages, searchTerm) {
  if (!searchTerm.trim()) {
    return messages;
  }

  return messages.filter(
    (message) =>
      message.user.toLowerCase().includes(searchTerm) ||
      message.message.toLowerCase().includes(searchTerm)
  );
}

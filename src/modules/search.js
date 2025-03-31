/**
 * Search module for filtering messages by username and content (Linns feature)
 */

let searchCallback = null;

export function initializeSearch(filterCallback) {
  searchCallback = filterCallback;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupSearchListener);
  } else {
    setupSearchListener();
  }
}

function setupSearchListener() {
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", handleSearchInput);
  }
}

function handleSearchInput(event) {
  const searchTerm = event.target.value.toLowerCase();
  performSearch(searchTerm);
}

export function performSearch(searchTerm = "") {
  if (searchCallback) {
    searchCallback(searchTerm);
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

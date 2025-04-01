const deleteButton = document.getElementById("delete");
let draggedOverDelete = false;

deleteButton.addEventListener("dragstart", (e) => {
  e.dataTransfer.setData("text/plain", "delete");
});

document.querySelectorAll(".message").forEach((note) => {
  note.addEventListener("dragover", (e) => {
    e.preventDefault();
    draggedOverDelete = true;
    note.classList.add("drag-delete-hover");
  });

  note.addEventListener("dragleave", () => {
    draggedOverDelete = false;
    note.classList.remove("drag-delete-hover");
  });

  note.addEventListener("drop", async (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/plain");
    if (data === "delete") {
      note.remove();
      const id = note.id;
      await removeMessageById(id); // Adjust this to your existing remove function
    }
    note.classList.remove("drag-delete-hover");
  });
});
import { useState } from "react";

export function TaskForm({ onTaskCreated }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const handleCreateTask = (e) => {
    e.preventDefault();

    try {
      const newTask = {
        id: Date.now().toString(),
        title: title.trim(),
        description: text.trim(),
        status: "pending",
      };

      if (onTaskCreated) {
        onTaskCreated(newTask);
      }
      setTitle("");
      setText("");
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mb-6">
      {!isOpen ? (
        <button onClick={() => setIsOpen(true)}>Create New Task</button>
      ) : (
        <form onSubmit={handleCreateTask}>
          <div className="form-field">
            <label htmlFor="title" className="mb-2 block font-bold">
              Title:
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter task title"
            />
          </div>
          <div className="form-field">
            <label htmlFor="text" className="mb-2 block font-bold">
              Text:
            </label>
            <textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter task description"
            />
          </div>
          <div className="form-actions">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded px-4 py-2 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-200"
            >
              Cancel
            </button>
            <button type="submit" className="">
              Create
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

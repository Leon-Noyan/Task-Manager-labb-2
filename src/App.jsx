import { useState, useEffect } from "react";
import "./App.css";
import { TaskForm } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";

function App() {
  const [storageError, setStorageError] = useState("");
  const [tasks, setTasks] = useState(() => {
    try {
      const savedTasks = localStorage.getItem("tasks");
      return savedTasks ? JSON.parse(savedTasks) : [];
    } catch (error) {
      console.error("Failed to read tasks from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("tasks", JSON.stringify(tasks));
      setStorageError("");
    } catch (error) {
      console.error("Failed to save tasks to localStorage", error);
      setStorageError("Could not save tasks to localStorage");
    }
  }, [tasks]);

  const handleTaskCreated = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  return (
    <main className="app">
      <section>
        <div>
          <h1 className="h1">Task Manager</h1>
          <p className="p">Create your tasks and view them below!</p>
        </div>

        {storageError && (
          <p role="alert" className="storage-error">
            {storageError}
          </p>
        )}

        <div>
          <TaskForm onTaskCreated={handleTaskCreated}></TaskForm>
        </div>
      </section>
      <section>
        <TaskList tasks={tasks} setTasks={setTasks} />
      </section>
    </main>
  );
}

export default App;

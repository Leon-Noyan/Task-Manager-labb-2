import { useState, useEffect } from "react";
import "./App.css";
import { TaskForm } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";
import { MonitorPanel } from "./components/Monitor";

function readNumberFromStorage(key) {
  try {
    return Number(localStorage.getItem(key)) || 0;
  } catch {
    return 0
  }
}

function readTasksFromStorage() {
  try {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  } catch (error) {
    console.error("Failed to read tasks from localStorage", error)
    return []
  }
}

function App() {
  const [createdCount, setCount] = useState(() =>
    readNumberFromStorage("createdCount")
  );
  const [errorCount, setErrorCount] = useState(() =>
    readNumberFromStorage("errorCount")
  );
  const [storageError, setStorageError] = useState("");
  const [failedStorageSim, setFailedStorageSim] = useState(false);
  const [tasks, setTasks] = useState(readTasksFromStorage)

  useEffect(() => {
    try {
      localStorage.setItem("tasks", JSON.stringify(tasks))
    } catch (error) {
      console.error("Failed to save tasks to localStorage", error)
    }
  }, [tasks])

 const errorRecord = () => {
  const nextErrorCount = errorCount + 1;
  setErrorCount(nextErrorCount)
  try {
  localStorage.setItem("errorCount", String(nextErrorCount));
  } catch (error) {
    console.error("Failed to save errorCount to localStorage", error)
  }
 }

 const persistentTasks = (nextTasks) => {
  setTasks(nextTasks)

  try {
    localStorage.setItem("tasks", JSON.stringify(nextTasks))
    setStorageError("")
    return true
  } catch (error) {
    console.error("Failed to save tasks to localStorage", error)
    setStorageError("Could not save tasks to localStorage")
    errorRecord()
    return false
  }
 }
  const handleTaskCreated = (newTask) => {
    if (failedStorageSim) {
      errorRecord();
      throw new Error("Failed storage error on purpose: failed to save task");
    }
    const nextTasks = [...tasks, newTask];
    persistentTasks(nextTasks)

    const nextCount = createdCount + 1;
    setCount(nextCount);
    try {
      localStorage.setItem("createdCount", String(nextCount))
    } catch (error) {
      console.error("Failed to save createdCount to localStorage", error)
    }
  }

  const handleReset = () => {
    setFailedStorageSim(false);
    setStorageError("");
    setCount(0);
    setErrorCount(0);
    try {
      localStorage.setItem("createdCount", "0");
      localStorage.setItem("errorCount", "0");
    } catch (error) {
      console.error("Failed to reset counts in localStorage", error);
    }
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
        <TaskList tasks={tasks} setTasks={persistentTasks} />
      </section>
      <section>
        {failedStorageSim && (
          <p role="status">
            Create a task - console will throw error and error count will
            increase. Note you can only reset during the simulation!
          </p>
        )}
        <MonitorPanel
          createdCount={createdCount}
          errorCount={errorCount}
          failedStorageSim={failedStorageSim}
        />
        <button
          type="button"
          className="simBtn"
          onClick={() => setFailedStorageSim(true)}
          disabled={failedStorageSim}
        >
          Simulate storage error
        </button>
        <button
          type="button"
          className="resetBtn"
          onClick={handleReset}
          disabled={!failedStorageSim}
        >
          Reset simulation
        </button>
      </section>
    </main>
  );
}


export default App;

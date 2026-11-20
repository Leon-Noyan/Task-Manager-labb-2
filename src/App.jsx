import { useState, useEffect } from "react";
import "./App.css";
import { TaskForm } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";
import { MonitorPanel } from "./components/Monitor";

function App() {
  const [createdCount, setCount] = useState(() => {
    return Number(localStorage.getItem("createdCount")) || 0;
  });
  const [errorCount, setErrorCount] = useState(() => {
    return Number(localStorage.getItem("errorCount")) || 0;
  });
  const [storageError, setStorageError] = useState("");
  const [failedStorageSim, setFailedStorageSim] = useState(false);
  const [tasks, setTasks] = useState(() => {
    try {
      const savedTasks = localStorage.getItem("tasks");
      return savedTasks ? JSON.parse(savedTasks) : [];
    } catch (error) {
      console.error("Failed to read tasks from localStorage", error);
      return [];
    }
  });

  const errorTotal = () => {
    setErrorCount((prev) => {
      const next = prev + 1;
      localStorage.setItem("errorCount", String(next));
      return next;
    });
  };

  useEffect(() => {
    try {
      localStorage.setItem("tasks", JSON.stringify(tasks));
      setStorageError("");
    } catch (error) {
      console.error("Failed to save tasks to localStorage", error);
      setStorageError("Could not save tasks to localStorage");
      errorTotal();
    }
  }, [tasks]);

  const handleTaskCreated = (newTask) => {
    if (failedStorageSim) {
      errorTotal();
      throw new Error("Failed storage error on purpose: failed to save task");
    }
    setTasks((prevTasks) => [...prevTasks, newTask]);

    setCount((prev) => {
      const next = prev + 1;
      localStorage.setItem("createdCount", String(next));
      return next;
    });
  };

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
        <TaskList tasks={tasks} setTasks={setTasks} />
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

import { useState, useEffect } from 'react'
import './App.css'
import { TaskForm } from './components/TaskForm'
import { TaskList } from './components/TaskList'

function App() {
    const [tasks, setTasks] = useState(() => {
        const savedTasks = localStorage.getItem('tasks')
        return savedTasks ? JSON.parse(savedTasks) : []
    })

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks))
    }, [tasks])

    const handleTaskCreated = (newTask) => {
        setTasks((prevTasks) => [...prevTasks, newTask])
    }

    return (
        <main className="app">
            <section>
                <div>
                    <h1 className="h1">Task Manager</h1>
                    <p className="p">Create your tasks and view them below!</p>
                </div>

                <div>
                    <TaskForm onTaskCreated={handleTaskCreated}></TaskForm>
                </div>
            </section>
            <section>
                <TaskList tasks={tasks} setTasks={setTasks} />
            </section>
        </main>
    )
}

export default App

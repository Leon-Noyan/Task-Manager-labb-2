// import { useState } from 'react'
import './App.css'
import { TaskForm } from './components/TaskForm'

function App() {
    return (
        <>
            <section>
                <div>
                    <h1>Task Manager</h1>
                    <p>Create your tasks and view them below!</p>
                </div>

                <div>
                    <TaskForm></TaskForm>
                </div>
            </section>
        </>
    )
}

export default App

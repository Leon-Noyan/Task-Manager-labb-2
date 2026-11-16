import { useState } from 'react'
//import { addLog } from '../utils/logger'

export function TaskForm({ onTaskCreated }) {
    const [IsOpen, setIsOpen] = useState(false)
    const [title, setTitle] = useState('')
    const [text, setText] = useState('')
    const [loading, setLoading] = useState(false)

    const handleCreateTask = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const newTask = {
                id: Date.now().toString(),
                title: title.trim(),
                description: text.trim(),
                status: 'pending'
            }

            const existingTasks = JSON.parse(
                localStorage.getItem('tasks') || '[]'
            )

            const updatedTasks = [...existingTasks, newTask]

            localStorage.setItem('tasks', JSON.stringify(updatedTasks))

            //addLog('INFO', `Task was created: "${newTask.title}"`)

            if (onTaskCreated) {
                onTaskCreated(newTask)
            }
            setTitle('')
            setText('')
        } catch (error) {
            // addLog('ERROR', 'Failed to save')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="mb-6">
            {!IsOpen ? (
                <button onClick={() => setIsOpen(true)}>Create New Task</button>
            ) : (
                <form onSubmit={handleCreateTask}>
                    <div className="mb-4">
                        <label htmlFor="title" className="mb-2 block font-bold">
                            Title:
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className=""
                            required
                            placeholder="Enter note title"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="text" className="mb-2 block font-bold">
                            Text:
                        </label>
                        <textarea
                            id="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className=""
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="rounded px-4 py-2 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button type="submit" className="">
                            {loading ? 'Creating...' : 'Create'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    )
}

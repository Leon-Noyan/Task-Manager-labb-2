import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TaskForm } from '../components/TaskForm'
import '@testing-library/jest-dom'

describe('TaskForm', () => {
    beforeEach(() => {
        // rensar localStorage
        localStorage.clear()
    })
    // helper function so we don't have to repeat creation
    const fillAndCreateTask = async (user) => {
        await user.click(
            screen.getByRole('button', { name: /create new task/i })
        )
        await user.type(screen.getByLabelText(/title/i), 'Go to gym')
        await user.type(screen.getByLabelText(/text/i), 'Train back')
        await user.click(screen.getByRole('button', { name: /^create$/i }))
    }

    it('Contains empty values when creating', async () => {
        render(<TaskForm />)

        const button = screen.getByRole('button', { name: /create new task/i })

        await userEvent.click(button)

        expect(screen.getByLabelText(/title/i)).toHaveValue('')
        expect(screen.getByLabelText(/text/i)).toHaveValue('')
        expect(screen.getByRole('button', { name: /^create$/i })).toBeEnabled()
    })

    it('Creates a new task', async () => {
        const user = userEvent.setup()
        const mockOnTaskCreated = vi.fn()

        render(<TaskForm onTaskCreated={mockOnTaskCreated} />)

        await fillAndCreateTask(user)

        expect(mockOnTaskCreated).toHaveBeenCalledWith(
            expect.objectContaining({
                title: 'Go to gym',
                description: 'Train back',
                status: 'pending'
            })
        )
    })

    it('Checks that a task cannot be created without a title', async () => {
        const user = userEvent.setup()
        const mockOnTaskCreated = vi.fn()

        render(<TaskForm onTaskCreated={mockOnTaskCreated} />)

        await user.click(
            screen.getByRole('button', { name: /create new task/i })
        )

        await user.type(screen.getByLabelText(/title/i), 'Train back')

        user.click(screen.getByRole('button', { name: /^create$/i }))

        expect(mockOnTaskCreated).not.toHaveBeenCalled()

        expect(screen.getByLabelText(/title/i)).toBeInvalid()
    })

    it('Does not create a task with only whitespace', async () => {
        const user = userEvent.setup()

        render(<TaskForm />)

        await user.type(screen.getByLabelText(/title/i), ' ')
        await user.click(screen.getByRole('button', { name: /^create$/i }))

        const savedTasks = JSON.parse(localStorage.getItem('tasks')) || []
        expect(savedTasks).toHaveLength(0)
    })

    it('Checks that task is being saved to localStorage', async () => {
        const user = userEvent.setup()

        render(<TaskForm />)

        await fillAndCreateTask(user)

        const savedTasks = JSON.parse(localStorage.getItem('tasks'))
        expect(savedTasks).toHaveLength(1)
        expect(savedTasks[0].title).toBe('Go to gym')
        expect(savedTasks[0].description).toBe('Train back')
        expect(savedTasks[0].status).toBe('pending')
    })

    it('Checks that task can change status', async () => {
        let status = 'pending'

        // status = toggleStatus(status)
        expect(status).toBeTruthy()
        expect(status).toBe('completed')
    })

    it('Checks that a task can be deleted', async () => {
        const user = userEvent.setup()
        const mockOnDelete = vi.fn()
        const task = {
            id: '1',
            title: 'Go to gym',
            description: 'Train back',
            status: 'pending'
        }

        render(<TaskItem task={task} onDelete={mockOnDelete} />)

        const deleteButton = screen.getByRole('button', { name: /delete/i })
        await user.click(deleteButton)

        expect(mockOnDelete).toHaveBeenCalledWith('1')
    })

    it('Checks correct amount completed tasks', async () => {
        const tasks = [
            { id: '1', title: 'Task 1', status: 'completed' },
            { id: '2', title: 'Task 2', status: 'pending' },
            { id: '3', title: 'Task 3', status: 'completed' }
        ]
        render(<TaskCounter tasks={tasks} />)

        const completed = screen.getByText(/2 of 3 completed/i)
        expect(completed).toBeInTheDocument()
    })
})

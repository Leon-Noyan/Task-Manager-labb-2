import { DeleteBtn } from './DeleteBtn'

export function TaskList({ tasks, setTasks }) {
    const handleToggleStatus = (id) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === id
                    ? {
                          ...task,
                          status:
                              task.status === 'completed'
                                  ? 'pending'
                                  : 'completed'
                      }
                    : task
            )
        )
    }

    return (
        <div>
            <h2 className="h2">Current Tasks</h2>
            {tasks.length === 0 ? (
                <p>No added tasks</p>
            ) : (
                <ul>
                    {tasks.map((task) => (
                        <li key={task.id}>
                            <span
                                style={{
                                    textDecoration:
                                        task.status === 'completed'
                                            ? 'line-through'
                                            : 'none'
                                }}
                            >
                                {task.title}: {task.description}
                            </span>
                            <div className="task-actions">
                                <button
                                    onClick={() => handleToggleStatus(task.id)}
                                >
                                    {task.status === 'pending'
                                        ? 'Mark as completed'
                                        : 'Mark as pending'}
                                </button>
                                <DeleteBtn id={task.id} setTasks={setTasks} />
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

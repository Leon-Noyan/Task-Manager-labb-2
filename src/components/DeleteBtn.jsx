export function DeleteBtn({ id, setTasks }) {
    const handleDelete = () => {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id))
    }

    return <button className="btn-danger" onClick={handleDelete}>Delete Task</button>
}

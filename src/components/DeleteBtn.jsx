import { getTimestamp } from "../utils/getTimestamp";

export function DeleteBtn({ id, setTasks, title }) {
  const handleDelete = () => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    console.info(`[INFO] ${getTimestamp()} - Task deleted: "${title || id}"`);
  };

  return (
    <button className="btn-danger" onClick={handleDelete}>
      Delete Task
    </button>
  );
}

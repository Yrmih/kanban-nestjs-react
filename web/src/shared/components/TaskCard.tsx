import type { Task } from "./types/task.interface";

interface TaskCardProps {
  task: Task;
}

const TaskCard = ({ task }: TaskCardProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="font-semibold">{task.title}</h3>
      <p>{task.description}</p>
      <div className="mt-2 text-right">
        <button className="bg-blue-500 text-white p-2 rounded">Editar</button>
        <button className="bg-red-500 text-white p-2 rounded ml-2">Deletar</button>
      </div>
    </div>
  );
};

export default TaskCard;

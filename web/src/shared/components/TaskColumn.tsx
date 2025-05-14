import React, { useState } from "react";
import TaskCard from "./TaskCard";

interface TaskColumnProps {
  status: string;
}

const TaskColumn: React.FC<TaskColumnProps> = ({ status }) => {
  const [tasks, setTasks] = useState([]); // Mockar tarefas

  return (
    <div className="w-1/4 p-4 bg-gray-200 rounded-lg">
      <h2 className="text-xl font-semibold capitalize">{status}</h2>
      <div className="space-y-4 mt-4">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default TaskColumn;
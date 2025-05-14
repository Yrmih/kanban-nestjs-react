
import TaskColumn from "./TaskColumn";

const TaskBoard = () => {
  return (
    <div className="flex justify-between space-x-4 p-4">
      <TaskColumn status="pending" />
      <TaskColumn status="in_progress" />
      <TaskColumn status="testing" />
      <TaskColumn status="done" />
    </div>
  );
};

export default TaskBoard;
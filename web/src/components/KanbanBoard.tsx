import { useEffect } from 'react';
import { useTaskStore } from '../store/taskStore'; 

const KanbanBoard = () => {
  const { fetchTasks } = useTaskStore();

  useEffect(() => {
    fetchTasks(); // Carrega as tarefas na primeira renderização
  }, []);

  return null; 
};

export default KanbanBoard;

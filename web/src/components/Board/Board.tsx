import { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Dashboard } from '@mui/icons-material';
import Column from '../Column/Column';
import TaskForm from '../TaskForm';
import { useTasks } from '../../context/TaskContext';
import type { Task } from '../../context/TaskContext';
import { togglePinTask } from '../../services/taskService';  // ajuste o caminho conforme seu projeto

const statuses = ['pending', 'in_progress', 'testing', 'done'] as const;

const Board = () => {
  const { tasks, updateTask, deleteTask } = useTasks();

  const [openForm, setOpenForm] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const [itemsByStatus, setItemsByStatus] = useState<Record<Task['status'], Task[]>>(() => {
    const map = {} as Record<Task['status'], Task[]>;
    statuses.forEach((status) => {
      map[status] = tasks
        .filter((task) => task.status === status)
        .sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return 0;
        });
    });
    return map;
  });

  useEffect(() => {
    const map = {} as Record<Task['status'], Task[]>;
    statuses.forEach((status) => {
      map[status] = tasks
        .filter((task) => task.status === status)
        .sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return 0;
        });
    });
    setItemsByStatus(map);
  }, [tasks]);

  useEffect(() => {
    const root = document.getElementById('root');
    if (!root) return;

    if (openForm) {
      root.setAttribute('inert', '');
      root.classList.add('blurred');
    } else {
      root.removeAttribute('inert');
      root.classList.remove('blurred');
    }

    return () => {
      root.removeAttribute('inert');
      root.classList.remove('blurred');
    };
  }, [openForm]);

  const handleEdit = (task: Task) => {
    setTaskToEdit(task);
    setOpenForm(true);
  };

  const handleDelete = (id: string) => {
    deleteTask(id);
  };

  // Avançar status
  const handleAdvanceTask = async (task: Task) => {
    const currentIndex = statuses.indexOf(task.status);
    if (currentIndex === -1 || currentIndex === statuses.length - 1) {
      return; // já está no último status ou inválido
    }
    const newStatus = statuses[currentIndex + 1];
    try {
      await updateTask({ ...task, status: newStatus });
    } catch (error) {
      console.error('Erro ao avançar tarefa:', error);
    }
  };

  // Retornar status
  const handleReturnTask = async (task: Task) => {
    const currentIndex = statuses.indexOf(task.status);
    if (currentIndex <= 0) {
      return; // já está no primeiro status ou inválido
    }
    const newStatus = statuses[currentIndex - 1];
    try {
      await updateTask({ ...task, status: newStatus });
    } catch (error) {
      console.error('Erro ao retornar tarefa:', error);
    }
  };

  // Alternar fixar/desfixar task
  const handleTogglePinTask = async (task: Task) => {
  try {
    const updatedTask = { ...task, isPinned: !task.isPinned };
    await updateTask(updatedTask); // isso atualiza backend + contexto local
  } catch (error) {
    console.error('Erro ao fixar/desfixar tarefa:', error);
  }
};


  return (
    <>
      <Box
        sx={{
          p: 2,
          mb: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h4"
          color="primary"
          fontWeight={700}
          display="flex"
          alignItems="center"
          gap={1}
        >
          <Dashboard fontSize="large" />
          Quadro de Tarefas
        </Typography>

        <Button variant="contained" onClick={() => setOpenForm(true)}>
          Criar Tarefa
        </Button>
      </Box>

      <Box
        sx={{
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {statuses.map((status) => (
          <Column
            key={status}
            status={status}
            tasks={itemsByStatus[status]}
            onEditTask={handleEdit}
            onDeleteTask={handleDelete}
            onAdvanceTask={handleAdvanceTask}
            onReturnTask={handleReturnTask}
            onTogglePin={handleTogglePinTask} // novo handler para fixar task
          />
        ))}
      </Box>

      <TaskForm
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setTaskToEdit(null);
        }}
        taskToEdit={taskToEdit}
      />
    </>
  );
};

export default Board;

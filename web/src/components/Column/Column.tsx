import React from 'react';
import { Box, Typography } from '@mui/material';
import { useDroppable } from '@dnd-kit/core';

import Card from '../Card/Card';
import type { Task } from '../../context/TaskContext';

interface ColumnProps {
  status: Task['status'];
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onAdvanceTask: (task: Task) => Promise<void>;
  onReturnTask: (task: Task) => Promise<void>;  // NOVO PROP
}

const statusLabels: Record<Task['status'], string> = {
  pending: 'Pendente',
  in_progress: 'Em Progresso',
  testing: 'Em Testes',
  done: 'Concluído',
};

const Column = ({ status, tasks, onEditTask, onDeleteTask, onAdvanceTask, onReturnTask }: ColumnProps) => {
  const { isOver, setNodeRef } = useDroppable({ id: status });

  const validTasks = React.useMemo(
    () => tasks.filter((task): task is Task => task !== undefined && task !== null),
    [tasks]
  );

  return (
    <Box
      sx={{
        width: { xs: '100%', md: 280 },
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 2,
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '80vh',
        overflowY: 'auto',
        transition: 'background-color 0.3s',
        border: isOver ? '2px solid' : '2px solid transparent',
        borderColor: isOver ? 'primary.main' : 'transparent',
      }}
    >
      <Typography
        variant="h6"
        sx={{
          p: 2,
          textAlign: 'center',
          fontWeight: '700',
          color: 'primary.main',
          borderBottom: 1,
          borderColor: 'divider',
          userSelect: 'none',
        }}
      >
        {statusLabels[status]}
      </Typography>

      <Box
        ref={setNodeRef}
        sx={{
          flexGrow: 1,
          minHeight: 120,
          p: 2,
          bgcolor: isOver ? 'action.hover' : 'inherit',
          transition: 'background-color 0.2s ease',
        }}
      >
        {validTasks.length === 0 ? (
          <Typography
            variant="body2"
            sx={{ textAlign: 'center', color: 'text.secondary', mt: 2 }}
          >
            Nenhuma tarefa aqui.
          </Typography>
        ) : (
          validTasks.map((task) => (
            <Card
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onAdvance={onAdvanceTask}
              onReturn={onReturnTask}
            />
          ))
        )}
      </Box>
    </Box>
  );
};

export default Column;

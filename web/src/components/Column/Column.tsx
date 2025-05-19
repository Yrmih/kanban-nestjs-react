// components/Column/Column.tsx
import { Box, Typography } from '@mui/material';
import { useDroppable } from '@dnd-kit/core';

import Card from '../Card/Card';
import type { Task } from '../../context/TaskContext';

interface ColumnProps {
  status: Task['status'];
  tasks: Task[];
  onEditTask: (task: Task) => void;
}

const statusLabels: Record<Task['status'], string> = {
  pending: 'Pendente',
  in_progress: 'Em Progresso',
  testing: 'Em Testes',
  done: 'Concluído',
};

const Column = ({ status, tasks, onEditTask }: ColumnProps) => {
  const { isOver, setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <Box
      sx={{
        minWidth: 280,
        bgcolor: 'background.paper',
        borderRadius: 1,
        boxShadow: 1,
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '80vh',
        overflowY: 'auto',
      }}
    >
      <Typography variant="h6" sx={{ p: 1, textAlign: 'center' }}>
        {statusLabels[status]}
      </Typography>

      <Box
        ref={setNodeRef}
        sx={{
          flexGrow: 1,
          minHeight: 100,
          bgcolor: isOver ? 'action.hover' : 'inherit',
          p: 1,
          transition: 'background-color 0.2s ease',
        }}
      >
        {tasks.map((task) => (
          <Card key={task.id} task={task} onEdit={onEditTask} />
        ))}
      </Box>
    </Box>
  );
};

export default Column;

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box, IconButton, Typography } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import type { Task } from '../../context/TaskContext';

interface CardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

// cores diferentes para cada status (exemplo)
const headerColors: Record<Task['status'], string> = {
  pending: '#f44336', // vermelho
  in_progress: '#2196f3', // azul
  testing: '#ff9800', // laranja
  done: '#4caf50', // verde
};

const Card = ({ task, onEdit, onDelete }: CardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginBottom: '8px',
    backgroundColor: '#fff',
    borderRadius: '4px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    cursor: 'grab',
    userSelect: 'none',
  };

  return (
    <Box ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {/* Cabeçalho colorido */}
      <Box
        sx={{
          backgroundColor: headerColors[task.status],
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4,
          padding: '4px 8px',
          color: '#fff',
          fontWeight: 'bold',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="subtitle1" sx={{ userSelect: 'none' }}>
          {task.title}
        </Typography>
        <Box>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            aria-label="editar tarefa"
            color="inherit"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            aria-label="excluir tarefa"
            color="inherit"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
          <DragIndicatorIcon
            fontSize="small"
            sx={{ ml: 1, cursor: 'grab', color: '#fff' }}
            aria-label="arrastar tarefa"
          />
        </Box>
      </Box>

      {/* Descrição da task */}
      {task.description && (
        <Box sx={{ padding: '8px' }}>
          <Typography variant="body2" color="text.secondary">
            {task.description}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Card;

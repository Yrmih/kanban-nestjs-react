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

const headerColors: Record<Task['status'], string> = {
  pending: '#f44336',       // vermelho
  in_progress: '#2196f3',   // azul
  testing: '#ff9800',       // laranja
  done: '#4caf50',          // verde
};

const Card = ({ task, onEdit, onDelete }: CardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style: React.CSSProperties = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    boxShadow: '0 4px 8px rgba(0,0,0,0.12)',
    cursor: 'grab',
    userSelect: 'none',
    display: 'flex',
    flexDirection: 'column',
  };

  return (
    <Box ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Box
        sx={{
          backgroundColor: headerColors[task.status],
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          padding: '8px 12px',
          color: '#fff',
          fontWeight: 'bold',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.15)',
        }}
      >
        <Typography variant="subtitle1" sx={{ userSelect: 'none', fontWeight: 600 }}>
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
            sx={{ color: 'rgba(255,255,255,0.9)' }}
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
            sx={{ color: 'rgba(255,255,255,0.9)' }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
          <DragIndicatorIcon
            fontSize="small"
            sx={{ ml: 1, cursor: 'grab', color: 'rgba(255,255,255,0.9)' }}
            aria-label="arrastar tarefa"
          />
        </Box>
      </Box>

      {task.description && (
        <Box sx={{ padding: '12px 16px', color: 'text.secondary' }}>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
            {task.description}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Card;

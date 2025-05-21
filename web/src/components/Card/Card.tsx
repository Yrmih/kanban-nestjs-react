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

  const style = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition,
  };

  return (
    <Box
      component="article"
      ref={setNodeRef}
      sx={{
        mb: 1.5,
        bgcolor: 'background.paper',
        borderRadius: 1,
        boxShadow: 2,
        userSelect: 'none',
        display: 'flex',
        flexDirection: 'column',
        ...style,
      }}
      // Não passa attributes/listeners aqui para evitar drag indesejado
    >
      <Box
        sx={{
          backgroundColor: headerColors[task.status],
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          p: 1,
          color: 'common.white',
          fontWeight: 'bold',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.15)',
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ userSelect: 'none', fontWeight: 600 }}
        >
          {task.title}
        </Typography>

        <Box>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            aria-label="Editar tarefa"
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
            aria-label="Excluir tarefa"
            sx={{ color: 'rgba(255,255,255,0.9)' }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>

          {/* Drag handle */}
          <IconButton
            size="small"
            {...attributes}
            {...listeners}
            aria-label="Arrastar tarefa"
            sx={{
              ml: 1,
              cursor: 'grab',
              color: 'rgba(255,255,255,0.9)',
              p: 0.5,
            }}
          >
            <DragIndicatorIcon fontSize="small" aria-hidden="true" />
          </IconButton>
        </Box>
      </Box>

      {task.description && (
        <Box sx={{ p: 2, color: 'text.secondary' }}>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
            {task.description}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Card;

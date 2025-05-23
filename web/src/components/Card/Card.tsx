import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Box,
  IconButton,
  Typography,
  Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PushPinIcon from '@mui/icons-material/PushPin';

import type { Task } from '../../context/TaskContext';

interface CardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onAdvance?: (task: Task) => void;
  onReturn?: (task: Task) => void;
  onTogglePin: (task: Task) => void;
}

const headerColors: Record<Task['status'], string> = {
  pending: '#f44336',
  in_progress: '#2196f3',
  testing: '#ff9800',
  done: '#4caf50',
};

const Card = ({
  task,
  onEdit,
  onDelete,
  onAdvance,
  onReturn,
  onTogglePin,
}: CardProps) => {
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

  const canAdvance = task.status !== 'done';
  const canReturn = task.status !== 'pending';

  return (
    <Box
      component="article"
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      sx={{
        mb: 1.5,
        bgcolor: 'background.paper',
        borderRadius: 1,
        boxShadow: 2,
        userSelect: 'none',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'grab',
        border: task.isPinned ? '2px solid #FFC107' : 'none', // Borda amarelo ouro para fixado
        ...style,
      }}
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
          userSelect: 'none',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {task.title}
          </Typography>

          {task.isPinned && (
            <Typography
              variant="caption"
              sx={{
                color: '#FFC107',
                fontWeight: 500,
                mt: 0.2,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Fixada
            </Typography>
          )}
        </Box>

        <Box>
          <Tooltip title={task.isPinned ? 'Desafixar' : 'Fixar'}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onTogglePin(task);
              }}
              aria-label={task.isPinned ? 'Desafixar tarefa' : 'Fixar tarefa'}
              sx={{
                color: task.isPinned ? '#FFC107' : '#FFF',
                mr: 1,
              }}
            >
              <PushPinIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {canReturn && onReturn && (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onReturn(task);
              }}
              aria-label="Retornar tarefa"
              sx={{ color: 'rgba(255,255,255,0.9)', mr: 1 }}
            >
              <ArrowBackIcon fontSize="small" />
            </IconButton>
          )}

          {canAdvance && onAdvance && (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onAdvance(task);
              }}
              aria-label="Avançar tarefa"
              sx={{ color: 'rgba(255,255,255,0.9)', mr: 1 }}
            >
              <ArrowForwardIcon fontSize="small" />
            </IconButton>
          )}

          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            aria-label="Editar tarefa"
            sx={{ color: 'rgba(255,255,255,0.9)', mr: 1 }}
          >
            <EditIcon fontSize="small" />
          </IconButton>

          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm('Tem certeza que deseja deletar esta tarefa?')) {
                onDelete(task.id);
              }
            }}
            aria-label="Deletar tarefa"
            sx={{ color: 'rgba(255,255,255,0.9)' }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ p: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
          {task.description}
        </Typography>
      </Box>
    </Box>
  );
};

export default Card;

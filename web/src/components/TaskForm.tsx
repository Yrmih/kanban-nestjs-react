import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useTasks } from '../context/TaskContext';
import type { Task } from '../context/TaskContext';

import { getColumns } from '../services/taskService';

// Validação do formulário (incluindo status e columnId)
const schema = z.object({
  title: z.string().min(1, 'Título obrigatório'),
  description: z.string().optional(),
  columnId: z.number(),
  status: z.enum(['pending', 'in_progress', 'testing', 'done']),
});

type FormData = z.infer<typeof schema>;

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  taskToEdit: Task | null;
}

interface Column {
  id: number;
  title: string;
}

const TaskForm = ({ open, onClose, taskToEdit }: TaskFormProps) => {
  const { addTask, updateTask } = useTasks();
  const [columns, setColumns] = useState<Column[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      columnId: 1,    // default para a primeira coluna
      status: 'pending', // default para status
    },
  });

  // Busca colunas do backend quando o modal abre
  useEffect(() => {
    const fetchColumns = async () => {
      try {
        const cols = await getColumns();
        setColumns(cols);
      } catch (err) {
        console.error('Erro ao buscar colunas', err);
      }
    };

    if (open) fetchColumns();
  }, [open]);

  // Se estiver editando, preencher formulário com dados da tarefa
  useEffect(() => {
    if (taskToEdit) {
      reset({
        title: taskToEdit.title ?? '',
        description: taskToEdit.description ?? '',
        columnId: taskToEdit.columnId ?? 1,
        status: taskToEdit.status ?? 'pending',
      });
    } else {
      reset({
        title: '',
        description: '',
        columnId: 1,
        status: 'pending',
      });
    }
  }, [taskToEdit, reset]);

  // Enviar formulário: chama addTask ou updateTask com todos os dados necessários
  const onSubmit = async (data: FormData) => {
    if (taskToEdit) {
      await updateTask({ ...taskToEdit, ...data });
    } else {
      await addTask(data);
    }
    reset();
    onClose();
  };

  // Fecha o modal e reseta o form
  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>{taskToEdit ? 'Editar Tarefa' : 'Nova Tarefa'}</DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Título"
            {...register('title')}
            error={!!errors.title}
            helperText={errors.title?.message}
            fullWidth
          />

          <TextField
            label="Descrição"
            {...register('description')}
            multiline
            rows={3}
            fullWidth
          />

          {/* Select dinâmico para colunas */}
          <TextField
            select
            label="Coluna"
            {...register('columnId', { valueAsNumber: true })}
            fullWidth
            error={!!errors.columnId}
            helperText={errors.columnId?.message}
          >
            {columns.map((col) => (
              <MenuItem key={col.id} value={col.id}>
                {col.title}
              </MenuItem>
            ))}
          </TextField>

          {/* Select para status da tarefa */}
          <TextField
            select
            label="Status"
            {...register('status')}
            fullWidth
            error={!!errors.status}
            helperText={errors.status?.message}
          >
            <MenuItem value="pending">Pendente</MenuItem>
            <MenuItem value="in_progress">Em progresso</MenuItem>
            <MenuItem value="testing">Testando</MenuItem>
            <MenuItem value="done">Concluído</MenuItem>
          </TextField>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button type="submit" variant="contained">
            {taskToEdit ? 'Salvar Alterações' : 'Criar Tarefa'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskForm;

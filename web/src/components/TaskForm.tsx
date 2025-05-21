import { useEffect } from 'react';
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

// Esquema de validação
const schema = z.object({
  title: z.string().min(1, 'Título obrigatório'),
  description: z.string().optional(),
  status: z.enum(['pending', 'in_progress', 'testing', 'done']),
});

type FormData = z.infer<typeof schema>;

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  taskToEdit: Task | null;
}

// Mapeamento de status para columnId
const statusToColumnIdMap = {
  pending: 1,
  in_progress: 2,
  testing: 3,
  done: 4,
} as const;

const TaskForm = ({ open, onClose, taskToEdit }: TaskFormProps) => {
  const { addTask, updateTask } = useTasks();

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
      status: 'pending',
    },
  });

  // Preenche o formulário se estiver editando
  useEffect(() => {
    if (taskToEdit) {
      reset({
        title: taskToEdit.title ?? '',
        description: taskToEdit.description ?? '',
        status: taskToEdit.status ?? 'pending',
      });
    } else {
      reset({
        title: '',
        description: '',
        status: 'pending',
      });
    }
  }, [taskToEdit, reset]);

  // Submissão do formulário com columnId baseado no status
  const onSubmit = async (data: FormData) => {
    const columnId = statusToColumnIdMap[data.status];
    const taskPayload = { ...data, columnId };

    if (taskToEdit) {
      await updateTask({ ...taskToEdit, ...taskPayload });
    } else {
      await addTask(taskPayload);
    }

    reset();
    onClose();
  };

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

          <TextField select label="Status" {...register('status')} fullWidth>
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

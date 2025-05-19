import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

import { useTasks, type Task } from '../context/TaskContext';

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
      title: taskToEdit?.title ?? '',
      description: taskToEdit?.description ?? '',
      status: taskToEdit?.status ?? 'pending',
    },
  });

  const onSubmit = (data: FormData) => {
    if (taskToEdit) {
      updateTask({ ...taskToEdit, ...data });
    } else {
      const newTask: Task = {
        id: uuidv4(),
        ...data,
      };
      addTask(newTask);
    }
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
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

          <TextField
            select
            label="Status"
            defaultValue={taskToEdit?.status ?? 'pending'}
            {...register('status')}
            fullWidth
          >
            <MenuItem value="pending">Pendente</MenuItem>
            <MenuItem value="in_progress">Em progresso</MenuItem>
            <MenuItem value="testing">Testando</MenuItem>
            <MenuItem value="done">Concluído</MenuItem>
          </TextField>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained">
            {taskToEdit ? 'Salvar Alterações' : 'Criar Tarefa'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskForm;

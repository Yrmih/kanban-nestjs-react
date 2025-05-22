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
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useTasks } from '../context/TaskContext';
import type { Task } from '../context/TaskContext';
// import { getColumns } from '../services/taskService'; // 

// Validação do formulário
const schema = z.object({
  title: z.string().min(1, 'Título obrigatório'),
  description: z.string().optional(),
  columnId: z.number(), // Pode manter se necessário no backend
  status: z.enum(['pending', 'in_progress', 'testing', 'done']),
});

type FormData = z.infer<typeof schema>;

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  taskToEdit: Task | null;
}

// interface Column {
//   id: number;
//   title: string;
// }

const TaskForm = ({ open, onClose, taskToEdit }: TaskFormProps) => {
  const { addTask, updateTask } = useTasks();

  // const [columns, setColumns] = useState<Column[]>([]); // 

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      columnId: 1,
      status: 'pending',
    },
  });
  // deixei comentado para futuramente poder evoluir e melhor o sistema. 
  // useEffect(() => {
  //   const fetchColumns = async () => {
  //     try {
  //       const cols = await getColumns();
  //       setColumns(cols);
  //     } catch (err) {
  //       console.error('Erro ao buscar colunas', err);
  //     }
  //   };

  //   if (open) fetchColumns();
  // }, [open]);

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

  const onSubmit = async (data: FormData) => {
    if (taskToEdit) {
      await updateTask({ ...taskToEdit, ...data });
    } else {
      await addTask(data);
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

          {/* Coluna desabilitada temporariamente */}
          {/* 
          <Controller
            name="columnId"
            control={control}
            render={({ field }) => (
              <TextField
                select
                label="Coluna"
                fullWidth
                error={!!errors.columnId}
                helperText={errors.columnId?.message}
                {...field}
              >
                {columns.map((col) => (
                  <MenuItem key={col.id} value={col.id}>
                    {col.title}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          */}

          {/* Status */}
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <TextField
                select
                label="Status"
                fullWidth
                error={!!errors.status}
                helperText={errors.status?.message}
                {...field}
              >
                <MenuItem value="pending">Pendente</MenuItem>
                <MenuItem value="in_progress">Em progresso</MenuItem>
                <MenuItem value="testing">Testando</MenuItem>
                <MenuItem value="done">Concluído</MenuItem>
              </TextField>
            )}
          />
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

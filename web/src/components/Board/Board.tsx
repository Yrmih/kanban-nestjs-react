import { useState, useEffect } from 'react';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Box, Button, Typography } from '@mui/material';
import { Dashboard } from '@mui/icons-material';
import Column from '../Column/Column';
import TaskForm from '../TaskForm';
import { useTasks } from '../../context/TaskContext';
import type { Task } from '../../context/TaskContext';

const statuses = ['pending', 'in_progress', 'testing', 'done'] as const;

const Board = () => {
  const { tasks, updateTask, deleteTask } = useTasks();

  const [openForm, setOpenForm] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const [itemsByStatus, setItemsByStatus] = useState(() => {
    const map = {} as Record<Task['status'], string[]>;
    statuses.forEach((status) => {
      map[status] = tasks
        .filter((task) => task.status === status)
        .map((task) => task.id);
    });
    return map;
  });

  useEffect(() => {
    const map = {} as Record<Task['status'], string[]>;
    statuses.forEach((status) => {
      map[status] = tasks
        .filter((task) => task.status === status)
        .map((task) => task.id);
    });
    setItemsByStatus(map);
  }, [tasks]);

  useEffect(() => {
    const root = document.getElementById('root');
    if (!root) return;

    if (openForm) {
      root.setAttribute('inert', '');
      root.classList.add('blurred');
    } else {
      root.removeAttribute('inert');
      root.classList.remove('blurred');
    }

    return () => {
      root.removeAttribute('inert');
      root.classList.remove('blurred');
    };
  }, [openForm]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeContainer = active.data?.current?.sortable?.containerId as Task['status'] | undefined;
    const overContainer = over.data?.current?.sortable?.containerId as Task['status'] | undefined;

    if (!activeContainer || !overContainer) return;

    if (activeContainer === overContainer) {
      if (activeId !== overId) {
        setItemsByStatus((prev) => {
          const oldIndex = prev[activeContainer].indexOf(activeId);
          const newIndex = prev[overContainer].indexOf(overId);

          return {
            ...prev,
            [activeContainer]: arrayMove(prev[activeContainer], oldIndex, newIndex),
          };
        });
      }
    } else {
      setItemsByStatus((prev) => {
        const oldItems = [...prev[activeContainer]];
        const newItems = [...prev[overContainer]];

        const oldIndex = oldItems.indexOf(activeId);
        if (oldIndex > -1) oldItems.splice(oldIndex, 1);

        newItems.push(activeId);

        return {
          ...prev,
          [activeContainer]: oldItems,
          [overContainer]: newItems,
        };
      });

      try {
        await updateTask({
          ...(tasks.find((t) => t.id === activeId) as Task),
          status: overContainer,
        });
      } catch (error) {
        console.error('Erro ao atualizar tarefa:', error);
        // opcional: reverter estado ou alertar usuário
      }
    }
  };

  const handleEdit = (task: Task) => {
    setTaskToEdit(task);
    setOpenForm(true);
  };

  const handleDelete = (id: string) => {
    deleteTask(id);
  };

  return (
    <>
      <Box
        sx={{
          p: 2,
          mb: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h4"
          color="primary"
          fontWeight={700}
          display="flex"
          alignItems="center"
          gap={1}
        >
          <Dashboard fontSize="large" />
          Quadro de Tarefas
        </Typography>

        <Button variant="contained" onClick={() => setOpenForm(true)}>
          Criar Tarefa
        </Button>
      </Box>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {statuses.map((status) => (
            <SortableContext
              key={status}
              items={itemsByStatus[status]}
              strategy={verticalListSortingStrategy}
            >
              <Column
                status={status}
                tasks={itemsByStatus[status].map(
                  (id) => tasks.find((task) => task.id === id) as Task,
                )}
                onEditTask={handleEdit}
                onDeleteTask={handleDelete}
              />
            </SortableContext>
          ))}
        </Box>
      </DndContext>

      <TaskForm
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setTaskToEdit(null);
        }}
        taskToEdit={taskToEdit}
      />
    </>
  );
};

export default Board;

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

import Column from '../Column/Column';
import TaskForm from '../TaskForm';
import { useTasks } from '../../context/TaskContext';
import type { Task } from '../../context/TaskContext';

const statuses = ['pending', 'in_progress', 'testing', 'done'] as const;

const Board = () => {
  const { tasks, updateTask } = useTasks();
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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeContainer = active.data.current?.sortable.containerId as Task['status'] | undefined;
    const overContainer = over.data.current?.sortable.containerId as Task['status'] | undefined;

    if (!activeContainer || !overContainer) return;

    if (activeContainer === overContainer) {
      // Reordenar na mesma coluna
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
      // Mover entre colunas diferentes
      setItemsByStatus((prev) => {
        const oldItems = prev[activeContainer].filter(id => id !== activeId);
        const newItems = [activeId, ...prev[overContainer]]; // adiciona no topo da coluna

        return {
          ...prev,
          [activeContainer]: oldItems,
          [overContainer]: newItems,
        };
      });

      // Atualizar o status da task globalmente
      const taskToUpdate = tasks.find(t => t.id === activeId);
      if (taskToUpdate) {
        updateTask({ ...taskToUpdate, status: overContainer });
      }
    }
  };

  const handleOpenNewTask = () => {
    setTaskToEdit(null);
    setOpenForm(true);
  };

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setOpenForm(true);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" mb={2}>
        Kanban Board
      </Typography>

      <Button variant="contained" onClick={handleOpenNewTask} sx={{ mb: 2 }}>
        + Nova Tarefa
      </Button>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto' }}>
          {statuses.map((status) => (
            <SortableContext
              key={status}
              id={status}
              items={itemsByStatus[status]}
              strategy={verticalListSortingStrategy}
            >
              <Column
                status={status}
                tasks={itemsByStatus[status]
                  .map((id) => tasks.find((t) => t.id === id))
                  .filter(Boolean) as Task[]}
                onEditTask={handleEditTask}
              />
            </SortableContext>
          ))}
        </Box>
      </DndContext>

      <TaskForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        taskToEdit={taskToEdit}
      />
    </Box>
  );
};

export default Board;

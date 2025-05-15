import { useMutation } from '@tanstack/react-query';

import { useActiveBoard } from './useActiveBoard';

import { moveTask, type GetTasks } from '../services/task.service';

import { queryClient } from '../lib';

import { getTasksKey } from './useGetTask';

export const useMoveTask = () => {
	const { activeBoard } = useActiveBoard();

	// Se não houver quadro ativo, evita registrar a mutação
	if (!activeBoard?.id) {
		throw new Error('Nenhum quadro ativo selecionado.');
	}

	return useMutation({
		mutationFn: moveTask,
		onMutate: async (task) => {
			await queryClient.cancelQueries({
				queryKey: getTasksKey.single(activeBoard.id)
			});

			const oldColumns = queryClient.getQueryData<GetTasks[]>(
				getTasksKey.single(activeBoard.id)
			);

			const oldTaskInCache = oldColumns
				?.filter((col) => col.tasks.find((t) => t.id === task.taskId))[0]
				.tasks.filter((t) => t.id === task.taskId)[0];

			const oldColumnsWithoutPreviousColumn = oldColumns
				?.filter((col) => {
					const oldTask = col.tasks.find((t) => t.id === task.taskId);
					return !oldTask;
				})
				.map((col) => {
					if (col.id === task.columnId) {
						return {
							...col,
							tasks: [
								...col.tasks,
								{
									...oldTaskInCache,
									columnId: task.columnId,
									statusName: col.name,
									updatedAt: new Date().toISOString(),
									order:
										col.tasks.at(-1)?.order &&
										(col.tasks.at(-1)?.order as number) + 1
								}
							]
						};
					}

					return col;
				});

			const oldColumnWithRemovedTask = oldColumns
				?.filter((col) => col.tasks.find((t) => t.id === task.taskId))
				.map((col) => ({
					...col,
					tasks: col.tasks
						.map((t) => (t.id !== task.taskId ? t : undefined))
						.filter((t) => Boolean(t))
				}))[0];

			if (oldColumnsWithoutPreviousColumn) {
				queryClient.setQueryData(getTasksKey.single(activeBoard.id), [
					...oldColumnsWithoutPreviousColumn,
					oldColumnWithRemovedTask
				]);
			}

			return {
				oldColumnsWithoutPreviousColumn,
				oldColumnWithRemovedTask
			};
		},
		onSettled: () =>
			queryClient.invalidateQueries({
				queryKey: getTasksKey.single(activeBoard.id)
			})
	});
};

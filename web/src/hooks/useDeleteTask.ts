import { useMutation } from '@tanstack/react-query';

import { useActiveBoard } from './useActiveBoard';
import { deleteTask, type GetTasks } from '../services/task.service';
import { queryClient } from '../lib';
import { getTasksKey } from './useGetTask';

export const useDeleteTask = () => {
	const { activeBoard } = useActiveBoard();

	return useMutation({
		mutationFn: deleteTask,
		onMutate: async (data) => {
			if (!activeBoard?.id) return;

			// Cancelar queries relacionadas
			await queryClient.cancelQueries({
				queryKey: getTasksKey.single(activeBoard.id)
			});

			// Pegar dados antigos
			const oldColumns = queryClient.getQueryData<GetTasks[]>(
				getTasksKey.single(activeBoard.id)
			);

			// Atualizar com os dados novos (exclusão otimista)
			const newColumns = oldColumns?.map((col) => {
				const oldTask = col.tasks.find((t) => t.id === data.taskId);

				if (oldTask?.columnId === col.id) {
					return {
						...col,
						tasks: col.tasks.filter((t) => t.id !== data.taskId)
					};
				}

				return col;
			});

			queryClient.setQueryData(
				getTasksKey.single(activeBoard.id),
				newColumns
			);
		},
		onSettled: () => {
			if (!activeBoard?.id) return;

			queryClient.invalidateQueries({
				queryKey: getTasksKey.single(activeBoard.id)
			});
		}
	});
};

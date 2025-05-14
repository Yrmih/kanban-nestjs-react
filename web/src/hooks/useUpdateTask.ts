import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { BoardType } from '../stores/active-board-store';

import { updateTask } from '../services/task.service';
import type { GetTasks } from '../services/task.service';

import { getTasksKey } from './useGetTask';

export function useUpdateTask({ activeBoard }: { activeBoard: BoardType }) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateTask,
		onMutate: async (vars) => {
			const { id, columnId, description, subTasks, title } = vars;
			const queryKey = getTasksKey.single(activeBoard.id);

			// Cancelar requisições pendentes
			await queryClient.cancelQueries({queryKey});

			// Snapshot dos dados atuais
			const snapShotTasks = queryClient.getQueryData<GetTasks[]>(queryKey);

			// Atualização otimista
			if (snapShotTasks) {
				queryClient.setQueryData<GetTasks[]>(queryKey, (cols) =>
					cols?.map((col) => {
						if (col.id === columnId) {
							return {
								...col,
								tasks: col.tasks.map((task) =>
									task.id === id
										? {
												...task,
												title,
												description: description ?? null,
												subTasks,
												columnId,
												statusName: col.name,
										  }
										: task
								),
							};
						}
						return col;
					})
				);
			}

			return { snapShotTasks };
		},
		onSettled: () => {
			const queryKey = getTasksKey.single(activeBoard.id);
			queryClient.invalidateQueries({queryKey});
		},
	});
}

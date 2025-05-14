import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useActiveBoard } from './useActiveBoard';

import {
	createTask,
  type CreateTaskInput,
  type CreateTaskOutPutDto
} from '../services/task.service';

import type { ErrorApi } from '../types';

import { getTasksKey } from './useGetTask';

export const useCreateNewTaskMutation = () => {
	const queryClient = useQueryClient();
	const { activeBoard } = useActiveBoard();

	return useMutation<CreateTaskOutPutDto, ErrorApi, CreateTaskInput>({
		mutationFn: createTask,
		onSettled: () => {
			if (!activeBoard?.id) return; // pra evitar erro de undefined

			queryClient.invalidateQueries({
				queryKey: getTasksKey.single(activeBoard.id)
			});
		}
	});
};


import { useMutation } from '@tanstack/react-query';

import { deleteBoard, type DeleteBoardInput } from '../services/boards.service';

import type { ErrorApi } from '../types';

export const useDeleteBoardMutation = () =>
	useMutation<void, ErrorApi, DeleteBoardInput>({
		mutationFn: deleteBoard
	});

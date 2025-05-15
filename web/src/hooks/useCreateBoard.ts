import { useMutation } from '@tanstack/react-query';

import { createBoard } from '../services/boards.service';
import type { CreateBoardInput } from '../services/boards.service';
import type { ErrorApi } from '../types';

export const useCreateBoardMutation = () =>
	useMutation<void, ErrorApi, CreateBoardInput>({
		mutationFn: createBoard
	});

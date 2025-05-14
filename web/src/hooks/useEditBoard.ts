import { useMutation } from '@tanstack/react-query';

import { editBoard, type EditBoardInput, type EditBoardOutput } from '../services/boards.service';

import type { ErrorApi } from '../types';

export const useEditBoardMutation = () =>
	useMutation<EditBoardOutput, ErrorApi, EditBoardInput>({
		mutationFn: editBoard
	});

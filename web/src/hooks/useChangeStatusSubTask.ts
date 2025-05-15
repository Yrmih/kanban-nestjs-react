import { useMutation } from '@tanstack/react-query';

import { updateSubTaskStatus } from '../services/task.service';

export const useChangeStatusSubTask = () =>
	useMutation({
		mutationFn: updateSubTaskStatus
	});

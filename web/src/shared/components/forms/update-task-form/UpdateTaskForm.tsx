import { useEffect } from 'react';
import { useCallback } from 'react';
import { Controller, type SubmitHandler } from 'react-hook-form';

import { z } from 'zod';
// ButtonLoading,
// 	ButtonRemoveItemFormFormFieldArray,
// 	Dialog,
// 	DialogContent,
// 	DialogHeader,
// 	DialogOverlay,
// 	DialogPortal,
// 	Label,
// 	SelectStatusTask,
// 	TextArea,
// 	TextField
import { Button } from '../../Button';
import { ButtonLoading } from '../../ButtonLoading';
import { ButtonRemoveItemFormFormFieldArray } from '../../ButtonRemoveItemFromFormFieldArray';
import { Label } from '../../Label';
import { SelectStatusTask } from '../../SelectStatusTask';
import { TextArea } from '../../TextArea';
import { TextField } from '../../TextField';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogPortal } from '../../Dialog';

// useActiveBoard,	useInteractiveForm,
// 	useNotificationToasty,
// 	useUpdateTask
import { useActiveBoard } from '../../../../hooks/useActiveBoard';
import { useNotificationToasty } from '../../../../hooks/useNotificationToasty';
import { useUpdateTask } from '../../../../hooks/useUpdateTask';
import { cn } from '../../../../utils/cn';

import type { Task } from '../../../../types';

import { schema } from './schema';
import { useInteractiveForm } from '../../../../hooks/useInteractiveForm';

interface UpdateTaskTaskFormProps {
	task: Task;
	isOpenModal: boolean;
	onChangeModalState: () => void;
}

export function UpdateTaskTaskForm({
	task,
	isOpenModal,
	onChangeModalState
}: UpdateTaskTaskFormProps) {
	const { activeBoard } = useActiveBoard();
	const { notificationLoading } = useNotificationToasty();
	const mutation = useUpdateTask({ activeBoard: activeBoard! });
	const {
		register,
		handleSubmit,
		control,
		fields,
		handleInsertField,
		handleRemoveField,
		handleResetForm,
		formState: { errors }
	} = useInteractiveForm({
		schema,
		interactiveFieldName: 'subtasks',
		defaultValues: {
			name: task.name,
			description: task.description ?? undefined,
			columnId: task.columnId,
			subtasks: task.subtasks.map((sub) => ({
				id: sub.id,
				value: sub.name,
				isDone: sub.isDone
			}))
		}
	});
	const options = activeBoard!.columns.map((column) => ({
		id: column.id,
		value: column.name
	}));

	const onSubmit: SubmitHandler<z.output<typeof schema>> = (data) => {
		const editingSubTasksId = new Set(task.subtasks.map((sub) => sub.id));

		notificationLoading(
			mutation.mutateAsync({
				...data,
				title: data.name,
				id: task.id,
				subTasks: data.subtasks.map((subtask) =>
					editingSubTasksId.has(subtask.id)
						? { id: subtask.id, title: subtask.value, isDone: subtask.isDone }
						: {
								title: subtask.value,
								isDone: subtask.isDone
						  }
				)
			}),
			{
				success: 'Task edit successfully',
				loading: 'Save changes...',
				error: (e) => `${e.message}`
			}
		);
	};

	const onChangeOpen = useCallback(() => {
	handleResetForm();
	onChangeModalState();
}, [handleResetForm, onChangeModalState]);

useEffect(() => {
	if (mutation.isSuccess) {
		handleResetForm();
		onChangeOpen();
	}
}, [handleResetForm, mutation.isSuccess, onChangeOpen]);


	return (
		<Dialog open={isOpenModal} onOpenChange={onChangeOpen}>
			<DialogPortal>
				<DialogOverlay>
					<DialogContent>
						<DialogHeader>Edit Task</DialogHeader>

						<form onSubmit={handleSubmit(onSubmit)}>
							<Label label="Title">
								<TextField
									placeholder="e.g. Take coffee break"
									{...register('name')}
									errorMessage={errors.name?.message}
								/>
							</Label>

							<Label label="Description" className="mt-4">
								<TextArea
									{...register('description')}
									placeholder="e.g. It’s always good to take a break. This 15 minute break will recharge the batteries a little."
									errorMessage={errors.description?.message}
								/>
							</Label>

							<div className="mt-6">
								<p className="text-mediumGrey mb-2 text-[13px] font-bold dark:text-white">
									Subtasks
								</p>

								<div className="flex flex-col gap-4">
									{fields.map((column, index) => (
										<div
											className={cn('grid grid-cols-[1fr,auto] gap-x-4', {
												'place-items-start':
													errors.subtasks?.[index]?.value?.message
											})}
											key={column.id}
										>
											<TextField
												{...register(`subtasks.${index}.value` as const)}
												errorMessage={errors.subtasks?.[index]?.value?.message}
											/>
											<ButtonRemoveItemFormFormFieldArray
												title="Remove column"
												isErrorInField={
													!!errors.subtasks?.[index]?.value?.message
												}
												onClick={() => handleRemoveField(index)}
											/>
										</div>
									))}
									<Button
										variant="neutral"
										className={cn({
											'mb-4 my-0': fields.length > 0,
											'my-4': fields.length === 0
										})}
										disabled={mutation.isPending}
										onClick={() =>
											handleInsertField({
												id: crypto.randomUUID(),
												value: 'New Subtask',
												isDone: false
											})
										}
									>
										<span className="mb-0.5 inline-block font-bold">+</span>Add
										New SubTask
									</Button>
								</div>
							</div>

							<div className="my-6">
								<Controller
									name="columnId"
									defaultValue={task.id}
									control={control}
									render={({ field: { onChange, value } }) => (
										<Label label="Status">
											<SelectStatusTask
												options={options}
												defaultOption={{
													id: task.columnId,
													value: task.statusName
												}}
												value={value}
												onValueChange={onChange}
											/>
										</Label>
									)}
								/>
							</div>

							<ButtonLoading
								type="submit"
								isLoading={mutation.isPending}
								fallbackText="Saving"
								disabled={Object.keys(errors).length > 0 || mutation.isPending}
							>
								Save Changes
							</ButtonLoading>
						</form>
					</DialogContent>
				</DialogOverlay>
			</DialogPortal>
		</Dialog>
	);
}

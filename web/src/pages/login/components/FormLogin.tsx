import { type SubmitHandler, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { ButtonLoading } from '../../../shared/components/ButtonLoading';
import { Label } from '../../../shared/components/Label';
import { TextField } from '../../../shared/components/TextField';
import { useSignInMutation } from '../../../hooks/useSignIn';

const LoginSchema = z.object({
	email: z.string().min(1, { message: 'Cannot be empty' }).trim(),
	password: z.string().min(1, { message: 'Cannot be empty' }).trim()
});

type FormValues = z.infer<typeof LoginSchema>;

export function FormLogin() {
	const signinMutation = useSignInMutation();
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<FormValues>({
		resolver: zodResolver(LoginSchema)
	});

	const submitHandler: SubmitHandler<FormValues> = (data) => {
		signinMutation.mutate(data);
	};

	return (
		<form
			className="flex w-full flex-col gap-3"
			onSubmit={handleSubmit(submitHandler)}
		>
			<Label label="Email">
				<TextField
					type="email"
					placeholder="Ex: johndoe@gmail.com"
					{...register('email')}
					errorMessage={errors.email?.message}
				/>
			</Label>

			<Label label="Password">
				<TextField
					type="password"
					placeholder="Ex: ********"
					{...register('password')}
					errorMessage={errors.password?.message}
				/>
			</Label>

			<ButtonLoading
				type="submit"
				isLoading={signinMutation.isPending}
				fallbackText="Logging"
			>
				Login
			</ButtonLoading>
		</form>
	);
}

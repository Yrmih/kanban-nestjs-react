import { Link, Navigate } from 'react-router-dom';

import { useGetProfile } from '../../hooks/useGetProfile';

import { getAuthToken } from '../../utils/auth';

import { FormLogin } from './components/FormLogin';

export function LoginPage() {
	const { data } = useGetProfile(getAuthToken());

	if (data) {
		return <Navigate to="/" />;
	}

	return (
		<>
			<h1 className="text-mediumGrey mt-2 text-2xl font-bold dark:text-white">
				Login
			</h1>
			<FormLogin />
			<div className="mt-2 flex w-full items-center gap-2 text-sm">
				<p className="text-mediumGrey dark:text-white">No have account?</p>
				<Link
					to="/auth/register"
					className="font-medium text-blue-400 underline"
				>
					Register
				</Link>
			</div>
		</>
	);
}

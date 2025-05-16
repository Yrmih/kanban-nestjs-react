
import { redirect } from 'react-router-dom';
import { verifyToken } from '../../services/auth.service';
import { getAuthToken, removeAuthToken } from '../../utils/auth';

export const requireAuth = async () => {
	const token = getAuthToken();

	if (!token) {
		return redirect('/auth/login');
	}

	try {
		await verifyToken(token); // requisição que valida token
		return null;
	} catch (err) {
		console.error('Token inválido:', err);
		removeAuthToken();
		return redirect('/auth/login');
	}
};
//Validação de token

// import { redirect } from 'react-router-dom';
// import { verifyToken } from '../../services/auth.service';
// import { getAuthToken, removeAuthToken } from '../../utils/auth';

// export const requireAuth = async () => {
//   const token = getAuthToken();

//   if (!token) {
//     return redirect('/auth/login');
//   }

//   try {
//     await verifyToken(token);
//     return null; // continuar normalmente
//   } catch (err) {
//     console.error('Token inválido:', err);
//     removeAuthToken();
//     return redirect('/auth/login');
//   }
// };

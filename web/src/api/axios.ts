import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // vai pegar http://localhost:3000/api/v1 no dev
  withCredentials: true, // isso habilita envio de cookies (se seu backend usa cookies para auth)
});

api.get('/tasks').then(response => {
  console.log(response.data);
});

export default api;

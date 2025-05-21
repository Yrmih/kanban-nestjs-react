import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TaskProvider } from './context/TaskContext';
import Board from './components/Board/Board';
import Header from './components/Header';
import KanbanBoard from './components/KanbanBoard';
import { Toaster } from 'react-hot-toast';

//instância do QueryClient
const queryClient = new QueryClient();

const App = () => {
  return (
    
    <QueryClientProvider client={queryClient}>
      <TaskProvider>
        <Toaster position="top-right" reverseOrder={false} />
        <Header />
        <KanbanBoard />
        <Board />
      </TaskProvider>
    </QueryClientProvider>
  );
};

export default App;

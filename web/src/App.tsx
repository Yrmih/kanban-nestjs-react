import { TaskProvider } from './context/TaskContext';
import Board from './components/Board/Board';
import Header from './components/Header';
import KanbanBoard from './components/KanbanBoard';

const App = () => {
  return (
    <TaskProvider>
      <Header />
      <KanbanBoard />
      <Board />
    </TaskProvider>
  );
};

export default App;

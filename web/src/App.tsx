
import { TaskProvider } from './context/TaskContext';
import Board from './components/Board/Board';
import Header from './components/Header';

const App = () => {
  return (
    <TaskProvider>
      <Header />
      <Board />
    </TaskProvider>
  );
};

export default App;

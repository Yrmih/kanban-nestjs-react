import { BrowserRouter, Routes, Route } from 'react-router-dom'
import TaskBoard from './shared/components/TaskBoard';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        
        
        <TaskBoard />
      </Routes>
    </BrowserRouter>
  )
}

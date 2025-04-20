import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BoardsPage from './pages/BoardsPage';
import BoardPage from './pages/BoardPage';
import TasksPage from './pages/TasksPage';
import Header from './components/Header';
import { ModalProvider } from './hooks/useModal';
import TaskModal from './components/TaskModal';


const App = () => {
  return (
      <Router>
        <ModalProvider>
          <Header />
          <Routes>
            <Route path="/boards" element={<BoardsPage />} />
            <Route path="/board/:id" element={<BoardPage />} />
            <Route path="/issues" element={<TasksPage />} />

            <Route path="*" element={<Navigate to="/boards" replace />} />
          </Routes>
          <TaskModal />
        </ModalProvider>
      </Router>
  );
}

export default App;

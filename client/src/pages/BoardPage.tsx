import { useParams } from 'react-router-dom';
import { useBoardTasks } from '../hooks/useBoardTasks';
import { Task, taskStatuses } from '../api/utils';
import { updateTaskStatus } from '../api/api';
import {
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Box,
} from '@mui/material';
import { useState } from 'react';
import { queryClient } from '../main';
import TaskCard from '../components/BoardTaskCard';
import React from 'react';
import { useModal } from '../hooks/useModal';
import { useBoards } from '../hooks/useBoards';


const BoardPage = React.memo(() => {
  const { id } = useParams();
  const { data: boards } = useBoards();
  const { data: tasks = [], isLoading, error } = useBoardTasks(id!);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const { openModal } = useModal();

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDrop = async (status: Task["status"]) => {
    if (!draggedTask || draggedTask.status === status) return;

    try {
      await updateTaskStatus(draggedTask.id, status);
      const updated = tasks.map((t) =>
        t.id === draggedTask.id ? { ...t, status } : t
      );

      queryClient.setQueryData(['board-tasks', id], updated);
    } catch (err) {
      console.error('Ошибка при обновлении:', err);
    } finally {
      setDraggedTask(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  if (isLoading) return (
    <CircularProgress 
      size={'5rem'} 
      sx={{
        position: 'absolute', 
        marginLeft: 'auto',
        marginRight: 'auto',
        left: 0,
        right: 0,
        top: '50%',
      }}
    />
  );
  if (error) return <Alert severity="error">Ошибка загрузки задач</Alert>;

  const grouped = Object.fromEntries(
    taskStatuses.map((s) => [s, tasks.filter((t) => t.status === s)])
  );
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 2 }}>
      <Typography variant="h4" color="text.primary" gutterBottom>
        {boards?.find(board => board.id === Number(id))?.name}
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4, alignItems: 'stretch', height: '100%'}} >
        {taskStatuses.map((status) => (
          <Grid size={4} key={status} >
            <Paper
              sx={{ p: 2, backgroundColor: '#f4f4f4', height: '100%' }}
              onDrop={() => handleDrop(status)}
              onDragOver={handleDragOver}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>{status}</Typography>
              {grouped[status].map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  isDragging={draggedTask?.id === task.id}
                  onClick={() => openModal(task.id)}
                  onDragStart={() => handleDragStart(task)}
                />
              ))}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
});

export default BoardPage;

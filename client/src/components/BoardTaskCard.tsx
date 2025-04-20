import { Card, Typography, Avatar, Box, Chip } from '@mui/material';
import { Task } from '../api/utils';
import React from 'react';

interface TaskCardProps {
  task: Task;
  onClick: (id?: number) => void;
  onDragStart: () => void;
  isDragging?: boolean;
}

const TaskCard = React.memo(({ task, onDragStart, onClick}: TaskCardProps) => { 
  return (
    <Card
      draggable
      onClick={() => onClick()}
      onDragStart={onDragStart}
      sx={{
        position: 'relative',
        p: 2,
        mb: 2,
        bgcolor: 'white',
        cursor: 'pointer',
        boxShadow: 1,
        borderLeft: `4px solid ${
          task.priority === 'High' ? '#e53935' : task.priority === 'Medium' ? '#fb8c00' : '#43a047'
        }`,
        transition: '0.2s',
        '&:hover': {
          boxShadow: 3,
        },
      }}
    >
      <Typography variant="subtitle1" fontWeight="bold">
        {task.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {task.description}
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {task.assignee?.avatarUrl && (
            <Avatar src={task.assignee.avatarUrl} sx={{ width: 24, height: 24 }} />
          )}
          <Typography variant="caption">
            {task.assignee?.fullName || 'Без исполнителя'}
          </Typography>
        </Box>
        <Chip
            label={task.priority}
            size="small"
            color={task.priority === 'High' ? 'error' : task.priority === 'Medium' ? 'warning' : 'success'}
          />
      </Box>    
    </Card>
  );
});

export default TaskCard;

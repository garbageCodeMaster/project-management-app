import { 
  Avatar, 
  Box, 
  Card, 
  CardContent, 
  Chip, 
  Typography 
} from "@mui/material";
import React from "react";
import { Task } from "../api/utils";


const TaskCard = React.memo(({ task, onClick }: { task: Task; onClick: (id: number) => void }) => (
  <Card 
    sx={{ 
      m: 1, 
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
    onClick={() => onClick(task.id)}
  >
    <CardContent>
      <Typography variant="h6">{task.title}</Typography>
      <Typography variant="body2">{task.description}</Typography>
      <Chip label={`Статус: ${task.status}`} sx={{ mr: 1, mt: 1 }} />
      <Chip label={`Приоритет: ${task.priority}`} sx={{ mr: 1, mt: 1 }} />
      <Chip label={`Доска: ${task.boardName}`} sx={{ mr: 1, mt: 1 }} />
      {task.assignee && (
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <Avatar src={task.assignee.avatarUrl} sx={{ width: 24, height: 24, mr: 1 }} />
          <Typography variant="body2">{task.assignee.fullName}</Typography>
        </Box>
      )}
    </CardContent>
  </Card>
));

export default TaskCard;

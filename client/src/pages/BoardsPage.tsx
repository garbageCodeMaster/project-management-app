import { useBoards } from '../hooks/useBoards';
import {
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import BoardCard from '../components/BoardCard';
import React from 'react';

const BoardsPage = React.memo(() => {
  const { data, isLoading, error } = useBoards();

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
  if (error) return <Alert severity="error">Ошибка загрузки досок</Alert>;

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      {data?.map((board) => (
        <BoardCard key={board.id} {...board} />
      ))}
    </Grid>
  );
});

export default BoardsPage;

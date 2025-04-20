import {
  Typography,
  CircularProgress,
  Alert,
  Avatar,
  Box,
  MenuItem,
  TextField,
  Autocomplete,
} from '@mui/material';
import { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useBoards } from '../hooks/useBoards';
import { useUsers } from '../hooks/useUsers';
import { useModal } from '../hooks/useModal';
import React from 'react';
import { Board, taskPriorities, taskStatuses, User } from '../api/utils';
import { Virtuoso } from 'react-virtuoso';
import TaskCard from '../components/TaskCard';

const TasksPage = React.memo(() => {
  const { openModal } = useModal();
  const { data: tasks, isLoading, error } = useTasks();
  const { data: boards } = useBoards();
  const { data: users } = useUsers();

  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [boardFilter, setBoardFilter] = useState<number[]>([]);
  const [assigneeFilter, setAssigneeFilter] = useState<number[]>([]);  
  const [searchText, setSearchText] = useState('');

  const boardOptions = React.useMemo(() => [{ id: -1, name: 'Все' }, ...(boards || [])] as Board[], [boards]);
  const userOptions = React.useMemo(() => [{ id: -1, fullName: 'Все', avatarUrl: '' }, ...(users || [])] as User[], [users]);

  const handleBoardChange = (_: any, value: Board[]) => {
    if (value.some((v) => v.id === -1)) {
      setBoardFilter([]);
    } else {
      setBoardFilter(value.map((v) => v.id));
    }
  };

  const handleUserChange = (_: any, value: User[]) => {
    if (value.some((v) => v.id === -1)) {
      setAssigneeFilter([]);
    } else {
      setAssigneeFilter(value.map((v) => v.id));
    }
  };

  const filteredTasks = React.useMemo(() => tasks?.filter((task) => {
    const matchesPriority = priorityFilter ? task.priority === priorityFilter : true;
    const matchesStatus = statusFilter ? task.status === statusFilter : true;
    const matchesBoard = boardFilter.length > 0 ? boardFilter.includes(task.boardId) : true;
    const matchesAssignee = assigneeFilter.length > 0 ? assigneeFilter.includes(task.assignee!.id) : true;
    const matchesSearch = task.title.toLowerCase().includes(searchText.toLowerCase().trim()) ||
                          task.assignee?.fullName?.toLowerCase().includes(searchText.toLowerCase().trim());
  
    return matchesPriority && matchesStatus && matchesBoard && matchesAssignee && matchesSearch;
  }), [priorityFilter, statusFilter, boardFilter, assigneeFilter, searchText, tasks]);

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

  return (
    <Box sx={{ display: 'flex', height: '100%', p: 2 }}>
      <Box sx={{ width: 280, display: 'flex', flexDirection: 'column', gap: 3, p: 2 }}>
        <Typography variant="h4" fontWeight="bold" color="text.primary">Фильтры</Typography>

        <Autocomplete
          multiple
          options={boardOptions}
          getOptionLabel={(option) => option.name}
          onChange={handleBoardChange}
          renderInput={(params) => <TextField {...params} label="Доски" />}
          limitTags={2}
          sx={{ width: 280 }}
        />

        <Autocomplete
          multiple
          options={userOptions}
          getOptionLabel={(option) => option.fullName}
          onChange={handleUserChange}
          renderOption={({ key, ...props }, option) => (
            <li key={key} {...props}>
              {option.id !== -1 && <Avatar src={option.avatarUrl} sx={{ width: 24, height: 24, mr: 1 }} />}
              {option.fullName}
            </li>
          )}
          renderInput={(params) => <TextField {...params} label="Исполнители" />}
          limitTags={2}
        />

        <TextField
          id="status-filter"
          label="Статус"
          select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <MenuItem key="" value="">Все</MenuItem>
          {taskStatuses.map(status => (
            <MenuItem key={status} value={status}>{status}</MenuItem>
          ))}
        </TextField>

        <TextField
          label="Приоритет"
          select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <MenuItem key="" value="">Все</MenuItem>
          {taskPriorities.map(priority => (
            <MenuItem key={priority} value={priority}>{priority}</MenuItem>
          ))}
        </TextField>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        <TextField
          label="Поиск"
          value={searchText}
          sx={{ mb: 2 }}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <div style={{ height: '100%' }}>
          {filteredTasks && filteredTasks.length ? (
            <Virtuoso
              data={filteredTasks}
              itemContent={(_, task) => (
                <TaskCard task={task} onClick={openModal} />
              )}
              style={{ height: '100%' }}
            />
          ) : (
            <Alert severity="info">Ничего не найдено</Alert>
          )}
        </div>
      </Box>
    </Box>
  );
});

export default TasksPage;

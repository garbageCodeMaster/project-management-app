import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Button, CircularProgress,
  Snackbar,
  Alert,
  Avatar,
  Box
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useBoards } from '../hooks/useBoards';
import { useUsers } from '../hooks/useUsers';
import { createTask, getTaskById, updateTask } from '../api/api';
import { CreateTask, Task, taskPriorities, taskStatuses, UpdateTask } from '../api/utils';
import { queryClient } from '../main';
import { useTaskById } from '../hooks/useTaskById';
import { useLocation, useNavigate } from 'react-router-dom';
import { useModal } from '../hooks/useModal';
import { getTaskDraft, saveTaskDraft, clearTaskDraft } from '../utils/draftStorage';

type FormTask = {
  title: string,
  description: string,
  boardId: string,
  boardName: string,
  assigneeId: string,
  priority: typeof taskPriorities[number],
  status: typeof taskStatuses[number] | ''
};

const TaskModal = () => {
  const { isModalOpen: open, closeModal: onClose, modalContent: taskId } = useModal();

  const location = useLocation();
  const navigate = useNavigate();

  const { data: boards } = useBoards();
  const { data: users } = useUsers();
  const { data: taskData, isLoading, error } = useTaskById(taskId ?? '');

  const pathname = window.location.pathname;
  const match = pathname.match(/^\/board\/(\d+)/);
  const boardId = match ? parseInt(match[1], 10) : null;

  const isOnBoard = location.pathname.startsWith('/board/');
  const isEdit = !!taskId;
  const draftKey = isEdit ? null : 'new';

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
  const [form, setForm] = useState({
    title: '',
    description: '',
    boardId: isOnBoard ? boardId : '',
    boardName: '',
    assigneeId: '',
    priority: 'Medium',
    status: '',
  } as FormTask);

  useEffect(() => {
    if (isEdit && taskData) {
      setForm({
        title: taskData.title,
        description: taskData.description,
        boardId: String(taskData.boardId),
        boardName: taskData.boardName, 
        assigneeId: String(taskData.assignee?.id ?? ''),
        priority: taskData.priority,
        status: taskData.status,
      });
    } else {
      if (isOnBoard) {
        setForm({
          title: '',
          description: '',
          boardId: String(boardId),
          boardName: '',
          assigneeId: '',
          priority: 'Medium',
          status: '',
        })
      } else {
        const saved = getTaskDraft<FormTask>(draftKey!);
        if (saved) {
          setForm(saved);
        } else {
          setForm({
            title: '',
            description: '',
            boardId: '',
            boardName: '',
            assigneeId: '',
            priority: 'Medium',
            status: '',
          })
        }
      }
    }
  }, [taskData, isEdit, open]);
  
  useEffect(() => {
    if (error)
      showSnackbar('Произошла ошибка загрузки данных задачи', 'error')
  }, [error]);

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updated = { ...form, [e.target.name]: e.target.value };
    setForm(updated);
    !!draftKey && saveTaskDraft(draftKey, updated);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (isEdit && taskId) {
        const updateTaskForm = {
          assigneeId: Number(form.assigneeId),
          title: form.title,
          description: form.description,
          status: form.status,
          priority: form.priority,
        } as UpdateTask;

        await updateTask(taskId, updateTaskForm);

        queryClient.setQueryData(['task', taskId], (old: Task) => ({ ...old, ...updateTaskForm }));
        queryClient.invalidateQueries({ queryKey: ['board-tasks'] });
        queryClient.invalidateQueries({ queryKey: ['tasks'] });

        showSnackbar('Задача успешно обновлена', 'success');
      } else {
        const newTask = {
          title: form.title,
          description: form.description,
          boardId: Number(form.boardId),
          assigneeId: Number(form.assigneeId),
          priority: form.priority,
        } as CreateTask;
        
        const { data } = await createTask(newTask);
        const fullTask = await getTaskById(data.id);
        
        queryClient.invalidateQueries({ queryKey: ['board-tasks'] });
        queryClient.setQueryData(['tasks'], (old: Task[] = []) => [...old, fullTask.data]);

        showSnackbar('Задача успешно создана', 'success');
      }

      !!draftKey && clearTaskDraft(draftKey);
      onClose();
    } catch (e) {
      console.error(`Ошибка ${isOnBoard ? 'создания' : 'сохранения'} задачи:`, e);
      showSnackbar(`Произошла ошибка при ${isOnBoard ? 'создании' : 'сохранении'}  задачи`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoToBoard = () => {
    const boardId = boards?.find((board) => board.name === form.boardName)?.id;
    navigate(`/board/${boardId}`);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isEdit ? 'Редактирование задачи' : 'Создание задачи'}
        </DialogTitle>
        <DialogContent>
          {(isEdit && isLoading) ? (
                <CircularProgress 
                  size={'5rem'} 
                  sx={{
                    display: 'block',
                    margin: 'auto',
                  }}
                />
          ) : (
            <Box component='form'>
              <TextField
                fullWidth label="Заголовок" name="title"
                value={form.title} onChange={handleChange} sx={{ my: 1 }}
              />
              <TextField
                fullWidth label="Описание" name="description"
                value={form.description} onChange={handleChange}
                sx={{ my: 1 }} multiline rows={3}
              />
              {
                isEdit ?
                  <TextField
                    fullWidth select label="Доска" name="boardId"
                    value={1} onChange={handleChange}
                    sx={{ my: 1 }} disabled
                  >
                    <MenuItem value={1}>{form.boardName}</MenuItem>
                  </TextField>
                :
                  <TextField
                    fullWidth select label="Доска" name="boardId"
                    value={form.boardId} onChange={handleChange}
                    disabled={isOnBoard}
                    sx={{ my: 1 }}
                  >
                    {boards?.map((b) => (
                      <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>
                    ))}
                  </TextField> 
              }
              
              <TextField
                fullWidth select label="Исполнитель" name="assigneeId"
                value={form.assigneeId} onChange={handleChange} sx={{ my: 1 }}
              >
                {users?.map((u) => (
                  <MenuItem key={u.id} value={u.id}>
                    <Box display='flex'>
                      <Avatar src={u.avatarUrl} sx={{ width: 24, height: 24, mr: 1 }} />
                      {u.fullName}
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth select label="Приоритет" name="priority"
                value={form.priority} onChange={handleChange} sx={{ my: 1 }}
              >
                {taskPriorities.map((p) => (
                  <MenuItem key={p} value={p}>{p}</MenuItem>
                ))}
              </TextField>
              {isEdit && (
                <TextField
                  fullWidth select label="Статус" name="status"
                  value={form.status} onChange={handleChange} sx={{ my: 1 }}
                >
                  {taskStatuses.map((s) => (
                    <MenuItem key={s} value={s}>{s}</MenuItem>
                  ))}
                </TextField>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{px: 3, pb: 2}}>
          {!isOnBoard && isEdit && (
            <Button sx={{ mr: 'auto' }} variant="outlined" onClick={handleGoToBoard}>
              Перейти на доску
            </Button>
          )}
          <Button onClick={() => { !!draftKey && clearTaskDraft(draftKey); onClose();}}>Отмена</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading} >
            { isEdit ? 'Сохранить' : 'Создать' }
            { loading && <CircularProgress size={25} color='secondary' sx={{position: 'absolute'}}/> }
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
    </>
  );
};

export default TaskModal;

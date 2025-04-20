import { AppBar, Toolbar, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useModal } from '../hooks/useModal';

const Header = () => {
  const { openModal } = useModal();

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/boards">Доски</Button>
          <Button color="inherit" component={Link} to="/issues">Задачи</Button>
          <Button color="inherit" onClick={() => openModal()}>Создать задачу</Button>
        </Toolbar>
      </AppBar>
    </>
  );
}

export default Header;

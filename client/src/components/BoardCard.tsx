import { Card, CardContent, Typography, Box, Chip, Grid } from '@mui/material';
import { Link } from 'react-router-dom';

interface BoardCardProps {
  id: number;
  name: string;
  description: string;
  taskCount: number;
}

const BoardCard = ({ id, name, description, taskCount }: BoardCardProps) => {
  return (
    <Grid container sx={{flexWrap:'wrap'}} size={6}>
      <Card
        component={Link}
        to={`/board/${id}`}
        sx={{
          textDecoration: 'none',
          p: 2,
          minHeight: '150px',
          flexGrow: 1,
          borderRadius: 3,
          boxShadow: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: '0.2s',
          '&:hover': {
            boxShadow: 4,
            transform: 'translateY(-2px)',
          },
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6" gutterBottom>{name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {description || 'Без описания'}
          </Typography>
        </CardContent>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
          <Chip
            label={`Задач: ${taskCount}`}
            size="small"
            color="primary"
          />
          <Chip
            label="Открыть доску"
            size="small"
            color="primary"
            variant="outlined"
          />
        </Box>
      </Card>
    </Grid>
  );
};

export default BoardCard;

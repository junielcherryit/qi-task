import * as React from 'react';
import { Container, List, ListItem, ListItemIcon, ListItemText, Paper, Stack, Typography } from '@mui/material';
import { AddTaskButton } from './components/addTaskButton';
import { useHttp } from './hooks/useHttp';
import { CheckCircle } from '@mui/icons-material';
import { EditTaskButton } from './components/editTaskButton';
import { DeleteTaskButton } from './components/deleteTaskButton';
import { CompleteTaskSwitch } from './components/completeTaskSwitch';
import { format } from 'date-fns';

function App() {
  const {request, loading, data} = useHttp()
  
  const getTasks = React.useCallback(async () => {
    await request({
      method: 'GET',
      url: '/tasks',
    }, {
    
    })
  }, [request])

  React.useEffect(() => {
    getTasks()
  }, [getTasks])

  console.log({ data })

  return (
    <Container maxWidth="sm">
      <Stack
        mt={3}
        gap={3}
      >

        <Typography
          component="h4"
          variant="h4"
        >
          Minhas Tarefas
        </Typography>

        <AddTaskButton 
          onCallback={() => getTasks()}
        />

        <Stack
          component={List} 
          gap={1}
        >
          {loading && 'Carregando...'}
          {!loading && data && data.map((task: any) => {
            return (
              <ListItem 
                component={Paper} key={task?.id}
                secondaryAction={
                  <Stack
                    gap={1}
                    flexDirection="row"
                    alignItems="center"
                  >
                    <CompleteTaskSwitch
                      id={task?.id}
                      defaultChecked={task?.completed}
                      onCallback={() => getTasks()}
                    />
                    <EditTaskButton 
                      id={task?.id}
                      defaultTask={task?.description}
                      onCallback={() => getTasks()}
                    />
                    <DeleteTaskButton 
                      id={task?.id}
                      onCallback={() => getTasks()}
                    />
                  </Stack>
                }
              >
                {task?.completed === 1 && (
                  <ListItemIcon>
                    <CheckCircle color='success' />
                  </ListItemIcon>
                )}
                <ListItemText 
                  primary={task.description} 
                  secondary={format(new Date(task?.deadline), 'dd/MM/yyyy : HH:mm:ss')}
                />
              </ListItem>
            )
          })}
        </Stack>
        
      </Stack>
    </Container>
  );
}

export default App;

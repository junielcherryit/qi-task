import { LoadingButton } from '@mui/lab';
import { IconButton, Modal, Paper, Stack, TextField, Typography } from '@mui/material';
import * as React from 'react';
import { useHttp } from '../../hooks/useHttp';
import { Edit } from '@mui/icons-material';

interface IEditTaskButton {
  id: any
  onCallback: any
  defaultTask: string
}

const EditTaskButton: React.FC<IEditTaskButton> = ({
  id,
  onCallback,
  defaultTask
}) => {
  const {request, loading} = useHttp()
  const [open, setOpen] = React.useState<boolean>(false);
  const [task, setTask] = React.useState<string>(defaultTask)
  const handleOpen = React.useCallback(() => setOpen(true), []);
  const handleClose = React.useCallback(() => setOpen(false), []);

  const handleEditTask = React.useCallback(async () => {
    await request({
      method: 'PUT',
      url: `/tasks/${id}`,
      data: {
        description: task
      }
    }, {
      onCallback: () => {
        onCallback()
        handleClose()
        setTask('')
      }
    })
  }, [handleClose, id, onCallback, request, task])
  
  return (
    <Stack
      justifyContent="flex-start"
      alignItems="flex-start"
    >
      <IconButton onClick={() => handleOpen()}>
        <Edit />
      </IconButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Stack
          gap={3}
          component={Paper} 
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Nova Tarefa
          </Typography>
          <TextField 
            label="Tarefa"
            placeholder='Digite a tarefa'
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
          <LoadingButton loading={loading} variant="contained" onClick={() => handleEditTask()}>
            Editar
          </LoadingButton>
        </Stack>
      </Modal>
    </Stack>
  )
}

export { EditTaskButton }
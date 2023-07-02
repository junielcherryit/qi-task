import { LoadingButton } from '@mui/lab';
import { IconButton } from '@mui/material';
import * as React from 'react';
import { useHttp } from '../../hooks/useHttp';
import { Delete } from '@mui/icons-material';

interface IDeleteTaskButton {
  id: any
  onCallback: any
}

const DeleteTaskButton: React.FC<IDeleteTaskButton> = ({
  id,
  onCallback
}) => {
  const {request, loading} = useHttp()
  const handleDeleteTask = React.useCallback(async () => {
    await request({
      method: 'DELETE',
      url: `/tasks/${id}`,
    }, {
      onCallback: () => {
        onCallback()
      }
    })
  }, [id, onCallback, request])
  
  return (
    <IconButton component={LoadingButton} loading={loading}  onClick={() => handleDeleteTask()}>
      <Delete />
    </IconButton>
  )
}

export { DeleteTaskButton }
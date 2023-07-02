import { Switch } from '@mui/material';
import * as React from 'react';
import { useHttp } from '../../hooks/useHttp';

interface ICompleteTaskSwitch {
  id: any
  defaultChecked: number
  onCallback: any
}

const CompleteTaskSwitch: React.FC<ICompleteTaskSwitch> = ({
  id,
  defaultChecked,
  onCallback
}) => {
  const {request, loading} = useHttp()
  const handleCompleteTask = React.useCallback(async () => {
    await request({
      method: 'PUT',
      url: `/tasks/${id}`,
      data: {
        completed: defaultChecked === 1 ? 0 : 1
      }
    }, {
      onCallback: () => {
        onCallback()
      }
    })
  }, [defaultChecked, id, onCallback, request])
  
  return (
    <Switch disabled={loading} defaultChecked={defaultChecked === 1} onClick={() => handleCompleteTask()} />
  )
}

export { CompleteTaskSwitch }
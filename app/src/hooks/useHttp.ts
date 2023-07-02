import * as React from 'react'
import Axios, { AxiosRequestConfig } from 'axios'

const http = Axios.create({
  baseURL: 'http://localhost:8000',
})

const useHttp = () => {
  const [ loading, setLoading ] = React.useState<boolean>(false)
  const [ data, setData ] = React.useState<any>(null)
  const [ error, setError ] = React.useState<any>(null)
  const request = React.useCallback(async (config: AxiosRequestConfig, { onCallback, onError }: any) => {
    try {
      setLoading(true)
      const response = await http(config)
      console.log({ response })
      setData(response.data)
      onCallback?.(response.data)
    } catch (e: any) {
      console.log({ e })
      setError(e.response?.data)
      onError?.(e.response?.data)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    request,
    data,
    error
  }
}

export { useHttp, http }
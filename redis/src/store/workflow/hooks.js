import { useSelector, useDispatch } from 'react-redux'
import { selectAllRequests, addRequest } from './workflowSlice'

export function useWorkflow() {
  const dispatch = useDispatch()
  const requests = useSelector(selectAllRequests)

  const addNewRequest = (request) => {
    dispatch(addRequest(request))
  }

  return { requests, addNewRequest }
}

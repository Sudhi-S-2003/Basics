import { useDispatch, useSelector } from 'react-redux'
import { addRequest, approveStore, selectAllRequests } from '../store/workflow/workflowSlice'

export default function WorkflowView() {
  const dispatch = useDispatch()
  const requests = useSelector(selectAllRequests)

  return (
    <div className="p-4">
      <h2 className="font-bold text-xl">Workflow Requests</h2>
      <button
        onClick={() =>
          dispatch(
            addRequest({
              id: Date.now().toString(),
              status: 'pending',
              currentStep: 'validation',
              stores: [{ id: 's1', status: 'pending' }],
            })
          )
        }
        className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
      >
        Add Request
      </button>

      <ul className="mt-4">
        {requests.map((req) => (
          <li key={req.id} className="border p-2 mb-2 rounded">
            <p>ID: {req.id}</p>
            <p>Status: {req.status}</p>
            <p>Step: {req.currentStep}</p>
            <button
              onClick={() =>
                dispatch(approveStore({ requestId: req.id, storeId: 's1', by: 'admin' }))
              }
              className="bg-green-500 text-white px-2 py-1 mt-2 rounded"
            >
              Approve Store
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

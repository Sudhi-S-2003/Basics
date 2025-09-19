import { createSelector } from '@reduxjs/toolkit'
import { selectAllRequests } from './workflowSlice'

export const selectActiveRequests = createSelector(
  selectAllRequests,
  (requests) => requests.filter((r) => r.status === 'active')
)

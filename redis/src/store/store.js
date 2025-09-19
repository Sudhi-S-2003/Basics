import { configureStore, combineReducers } from '@reduxjs/toolkit'
import workflowReducer from './workflow/workflowSlice'
import uiReducer from './ui/uiSlice'
import prefsReducer from './prefs/prefsSlice'

const rootReducer = combineReducers({
  workflow: workflowReducer,
  ui: uiReducer,
  prefs: prefsReducer,
})

// custom logger middleware example
const logger = (store) => (next) => (action) => {
  console.log('dispatching', action)
  const result = next(action)
  console.log('next state', store.getState())
  return result
}

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(logger), // extend chain
  devTools: true,
})

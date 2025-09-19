// app/store.js
import { configureStore } from '@reduxjs/toolkit'
import { createReducerManager } from './reducerManager'
import uiReducer from '../features/ui/uiSlice'

const staticReducers = {
  ui: uiReducer,
}

const reducerManager = createReducerManager(staticReducers)

export const store = configureStore({
  reducer: reducerManager.reduce,
})

store.reducerManager = reducerManager

// app/reducerManager.js (lightweight)
import { combineReducers } from '@reduxjs/toolkit';

export function createReducerManager(initialReducers) {
  const reducers = { ...initialReducers };
  let combinedReducer = combineReducers(reducers);
  const keysToRemove = [];

  return {
    reduce: (state, action) => {
      if (keysToRemove.length) {
        state = { ...state };
        keysToRemove.forEach(key => delete state[key]);
        keysToRemove.length = 0;
      }
      return combinedReducer(state, action);
    },
    add: (key, reducer) => {
      if (!key || reducers[key]) return;
      reducers[key] = reducer;
      combinedReducer = combineReducers(reducers);
    },
    remove: (key) => {
      if (!reducers[key]) return;
      delete reducers[key];
      keysToRemove.push(key);
      combinedReducer = combineReducers(reducers);
    },
    getReducerMap: () => reducers
  };
}

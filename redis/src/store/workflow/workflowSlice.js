// features/workflow/workflowSlice.js
import { createSlice, createEntityAdapter, createSelector } from '@reduxjs/toolkit';

const requestsAdapter = createEntityAdapter({ selectId: r => r.id });

const initialState = requestsAdapter.getInitialState({
  meta: { lastUpdated: null, activeRequestId: null }
});

const workflowSlice = createSlice({
  name: 'workflow',
  initialState,
  reducers: {
    addRequest: requestsAdapter.addOne,
    updateRequest: requestsAdapter.updateOne,
    removeRequest: requestsAdapter.removeOne,
    setActiveRequest: (state, action) => { state.meta.activeRequestId = action.payload; },

    // business transition example: approve a specific store in a request
    approveStore: (state, action) => {
      const { requestId, storeId, by } = action.payload;
      const req = state.entities[requestId];
      if (!req) return;
      // mutate safely thanks to Immer
      const store = req.stores.find(s => s.id === storeId);
      if (store) {
        store.status = 'approved';
        store.approvedBy = by;
        store.approvedAt = Date.now();
      }
    },
    // complex step transition
    advanceStep: (state, action) => {
      const { requestId } = action.payload;
      const req = state.entities[requestId];
      if (!req) return;
      // custom business logic
      if (req.currentStep === 'validation') req.currentStep = 'approval';
      else if (req.currentStep === 'approval') req.currentStep = 'completed';
    }
  }
});

export const {
  addRequest, updateRequest, removeRequest, setActiveRequest, approveStore, advanceStep
} = workflowSlice.actions;

export default workflowSlice.reducer;

// selectors
export const {
  selectById: selectRequestById,
  selectAll: selectAllRequests
} = requestsAdapter.getSelectors(state => state.workflow);

// memoized custom selector
export const selectPendingStoresForRequest = createSelector(
  (state, requestId) => selectRequestById(state, requestId),
  (request) => request ? request.stores.filter(s => s.status === 'pending') : []
);

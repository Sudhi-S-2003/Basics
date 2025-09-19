import { createSlice, createEntityAdapter, createSelector } from '@reduxjs/toolkit';
Let’s go one by one:

1. createSlice
📌 Purpose:
Helps you create Redux reducers + actions in one place.

Normally in Redux you’d write:

Action types ('ADD_REQUEST')

Action creators (function addRequest(payload) { return { type:'ADD_REQUEST', payload } })

Reducers (a switch on action.type)

➡️ With createSlice, all of that is generated for you in one compact definition.

✅ Example:

js
Copy code
const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => { state.value++ },
    add: (state, action) => { state.value += action.payload }
  }
})

export const { increment, add } = counterSlice.actions
export default counterSlice.reducer
increment and add are actions

The reducer is exported for the store

2. createEntityAdapter
📌 Purpose:
Makes it easy to manage collections of items in Redux.

Normally, you’d store data like this:

js
Copy code
state = {
  requests: [
    { id: 'r1', status: 'pending' },
    { id: 'r2', status: 'approved' }
  ]
}
Updating one request means looping over the array every time.

➡️ With Entity Adapter, data is stored in a normalized structure:

js
Copy code
state = {
  ids: ['r1', 'r2'],
  entities: {
    r1: { id: 'r1', status: 'pending' },
    r2: { id: 'r2', status: 'approved' }
  }
}
✅ Benefits:

Fast lookup by ID: state.entities[r1]

Built-in reducers: addOne, updateOne, removeOne, setAll, etc.

Built-in selectors: selectAll, selectById, selectIds

That’s why your code uses:

js
Copy code
const requestsAdapter = createEntityAdapter({ selectId: r => r.id });
This means: "Each request will be identified by its id field".

3. createSelector
📌 Purpose:
Used for memoized selectors (from Reselect).

A selector is a function that reads data from Redux state.

createSelector makes sure expensive calculations only re-run when inputs change.

✅ Example:

js
Copy code
const selectCounter = state => state.counter.value

const selectIsEven = createSelector(
  selectCounter,
  (value) => value % 2 === 0
)
Now:

selectIsEven(state) returns true/false

It only recalculates if state.counter.value changes

In your workflow example:

js
Copy code
export const selectPendingStoresForRequest = createSelector(
  (state, requestId) => selectRequestById(state, requestId),
  (request) => request ? request.stores.filter(s => s.status === 'pending') : []
);
It finds the request by ID

Then filters only the pending stores

If the request didn’t change, the function is cached → no recompute

✅ Summary in plain English:

createSlice → makes reducers + actions easier to write

createEntityAdapter → helps manage lists of things (like requests) in a fast & clean way

createSelector → lets you make smart "views" of the state without recalculating unnecessarily


// //// features/workflow/index.js
// import workflowReducer from './workflowSlice'
// import WorkflowView from './components/WorkflowView'

// export function initWorkflowFeature(store) {
//   store.reducerManager.add('workflow', workflowReducer)
//   return WorkflowView
// }

// //3. Use it in app (on demand)
// import { useState } from 'react'
// import { initWorkflowFeature } from './features/workflow'

// function App({ store }) {
//   const [WorkflowView, setWorkflowView] = useState(null)

//   const loadWorkflow = () => {
//     const Comp = initWorkflowFeature(store)
//     setWorkflowView(() => Comp)
//   }

//   return (
//     <div>
//       <button onClick={loadWorkflow}>Load Workflow Feature</button>
//       {WorkflowView && <WorkflowView />}
//     </div>
//   )
// }

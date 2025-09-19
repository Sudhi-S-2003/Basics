import WorkflowView from './components/WorkflowView'
import { useSelector, useDispatch } from 'react-redux'
import { toggleModal } from './store/ui/uiSlice'
import { setTheme } from './store/prefs/prefsSlice'

function App() {
  const dispatch = useDispatch()
  const ui = useSelector((state) => state.ui)
  const prefs = useSelector((state) => state.prefs)

  return (
    <div className={prefs.theme === 'dark' ? 'bg-gray-900 text-white min-h-screen' : 'bg-white text-black min-h-screen'}>
      <header className="p-4 flex justify-between items-center border-b">
        <h1 className="font-bold text-2xl">Redux Complex Client State</h1>
        <div className="space-x-2">
          <button
            onClick={() => dispatch(toggleModal())}
            className="bg-indigo-500 text-white px-3 py-1 rounded"
          >
            Toggle Modal
          </button>
          <button
            onClick={() => dispatch(setTheme(prefs.theme === 'dark' ? 'light' : 'dark'))}
            className="bg-gray-700 text-white px-3 py-1 rounded"
          >
            Switch Theme
          </button>
        </div>
      </header>

      {ui.modalOpen && (
        <div className="fixed top-10 right-10 bg-yellow-200 p-4 rounded shadow">
          <p>Modal is Open!</p>
        </div>
      )}

      <main className="p-4">
        <WorkflowView />
      </main>
    </div>
  )
}

export default App

import { Route, Routes } from "react-router-dom"
import HomePage from "./components/home/HomePage"
import DashBoard from "./components/dashboard/DashBoard"
import FormContainer from "./components/form/FormContainer"

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route path="/dashboard" element={<DashBoard />}>
        <Route path="form" element={<FormContainer/>} />
        <Route path="settings" element={<>Settings </>} />
      </Route>
    </Routes>

  )
}
export default App
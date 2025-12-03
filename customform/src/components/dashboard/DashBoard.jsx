import { Outlet } from "react-router-dom"
import { BugReportForm } from "../form/BugReportForm"

function DashBoard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Outlet /> {/* Nested routes render here */}
      {/* <BugReportForm/> */}
    </div>
  )
}

export default DashBoard

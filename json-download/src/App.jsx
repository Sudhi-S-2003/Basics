import { useEffect } from "react"
import downloadJson from "./utils/downloadJson"
import JsonUploader from "./JsonUploader"


function App() {
  // useEffect(()=>{
  //   downloadJson()
  // },[])

  return (
    <>
    <button onClick={downloadJson}>Download JSON</button>
    <JsonUploader/>
    </>
  )
}

export default App

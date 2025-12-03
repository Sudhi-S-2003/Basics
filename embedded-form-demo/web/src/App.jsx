import IFrame from "./components/IFrame"

const App=()=>{
      const formUrl = "http://localhost:5173/form";

    return (
        <IFrame formUrl={formUrl}/>
    )
}
export default App
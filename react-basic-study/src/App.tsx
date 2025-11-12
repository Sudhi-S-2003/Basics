import FileUri from "@components/fileUpload/fileUri";
import FormExamplePage from "@components/form/FormExamplePage"
function App() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">
        Hello Coders!..
      </h1>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">1. File</h2>
        <FileUri
          name="placeholder.png"
          uri="https://placehold.co/600x400/000000/FFFFFF/png"
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">2. Form</h2>
        <FormExamplePage/>
      
      
      </div>
    </div>
  );
}

export default App;

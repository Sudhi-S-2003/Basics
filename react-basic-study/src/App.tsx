import FileUri from "@components/fileUpload/fileUri";
import FormExamplePage from "@components/form/FormExamplePage"
import Component2FA from "@components/2fa/Component2FA"
import ProductBulkUploadGenerator from "@components/xlsxComponent/ProductBulkUploadGenerator" 
import Table2 from "@components/Table2"
import GeoLoacation from "@components/location/geoLoacation";

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
        <FormExamplePage />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">3.2FA</h2>
        <Component2FA />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">4.XLsX</h2>
        <ProductBulkUploadGenerator />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">5.Table</h2>
        <Table2 />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">6.GEO-Location</h2>
        <GeoLoacation/>
      </div>
    </div>
  );
}

export default App;

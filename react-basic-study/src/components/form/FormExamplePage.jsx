"use client";

import { useState } from "react";
import { defaultFields } from "./fieldTypes";
import FormModal from "./FormModal";


export default function FormExamplePage() {
  const [open, setOpen] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = (data) => {
    console.log("Form submitted:", data);
    setSubmittedData(data);
    handleClose();
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">FormModal Example</h1>
      
      <button
        onClick={handleOpen}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Open Form
      </button>

      {open && (
        <FormModal
          head="Add Product"
          onClose={handleClose}
          onSubmit={handleSubmit}
          fields={defaultFields} // Using your defaultFields
          initialValue={{
            title: "Example Product",
            variants: [{ name: "Variant 1", price: 99 }],
          }}
          btnLabel="Save Product"
        />
      )}

      {submittedData && (
        <div className="mt-6 bg-gray-100 p-4 rounded">
          <h2 className="font-semibold">Submitted Data:</h2>
          <pre className="text-sm">{JSON.stringify(submittedData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

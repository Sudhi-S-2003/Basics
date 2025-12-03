import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Download, FileSpreadsheet, Plus, Trash2 } from 'lucide-react';

export default function ProductBulkUploadGenerator() {
  const [states, setStates] = useState(['Karnataka', 'Tamil Nadu', 'Kerala']);
  const [newState, setNewState] = useState('');
  const [sampleRows, setSampleRows] = useState(5);

  const addState = () => {
    if (newState.trim() && !states.includes(newState.trim())) {
      setStates([...states, newState.trim()]);
      setNewState('');
    }
  };

  const removeState = (index: number) => {
    setStates(states.filter((_, i) => i !== index));
  };

  const generateExcel = () => {
    // Create sample data
    const sampleData = [];
    
    // Add sample rows
    for (let i = 1; i <= sampleRows; i++) {
      const row: { [key: string]: string | number } = {
        code: `PROD${String(i).padStart(3, '0')}`,
        name: `Product ${i}`,
        mrp: 100 + (i * 10)
      };
      
      // Add state columns
      states.forEach(state => {
        row[state] = 90 + (i * 8); // Sample state-specific price
      });
      
      sampleData.push(row);
    }

    // Create workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(sampleData);

    // Set column widths
    const colWidths = [
      { wch: 15 }, // code
      { wch: 30 }, // name
      { wch: 12 }, // mrp
      ...states.map(() => ({ wch: 15 })) // state columns
    ];
    ws['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Products');

    // Generate file
    XLSX.writeFile(wb, 'product_bulk_upload_template.xlsx');
  };

  const generateEmptyTemplate = () => {
    // Create empty template with headers only
    const headers: { [key: string]: string | number } = {
      code: 'CODE001',
      name: 'Sample Product Name',
      mrp: 150
    };
    
    states.forEach(state => {
      headers[state] = 135;
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet([headers]);

    // Set column widths
    const colWidths = [
      { wch: 15 },
      { wch: 30 },
      { wch: 12 },
      ...states.map(() => ({ wch: 15 }))
    ];
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, 'Products');
    XLSX.writeFile(wb, 'product_bulk_upload_empty_template.xlsx');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <FileSpreadsheet className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">
              Product Bulk Upload Excel Generator
            </h1>
          </div>

          <div className="space-y-6">
            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Required Columns:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li><strong>code</strong> - Product code (required, unique)</li>
                <li><strong>name</strong> - Product name (required)</li>
                <li><strong>mrp</strong> - Maximum Retail Price (required)</li>
                <li><strong>State columns</strong> - State-specific prices (add states below)</li>
              </ul>
            </div>

            {/* State Management */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Manage States</h3>
              
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newState}
                  onChange={(e) => setNewState(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addState()}
                  placeholder="Enter state name"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  onClick={addState}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {states.map((state, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full"
                  >
                    <span className="text-sm font-medium">{state}</span>
                    <button
                      onClick={() => removeState(index)}
                      className="hover:bg-indigo-200 rounded-full p-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Sample Rows */}
            <div className="border border-gray-200 rounded-lg p-4">
              <label className="block font-semibold text-gray-800 mb-2">
                Number of Sample Rows
              </label>
              <input
                type="number"
                value={sampleRows}
                onChange={(e) => setSampleRows(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                max="100"
                className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Column Preview */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Template Columns Preview:</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm font-medium">
                  code
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm font-medium">
                  name
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm font-medium">
                  mrp
                </span>
                {states.map((state, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium"
                  >
                    {state}
                  </span>
                ))}
              </div>
            </div>

            {/* Download Buttons */}
            <div className="flex gap-4">
              <button
                onClick={generateExcel}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold shadow-md"
              >
                <Download className="w-5 h-5" />
                Download Template with Sample Data
              </button>
              
              <button
                onClick={generateEmptyTemplate}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-semibold shadow-md"
              >
                <Download className="w-5 h-5" />
                Download Empty Template
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useState } from "react";
import SmartTable from "./SmartTable";

function Table2() {
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Department", accessor: "department" },
    { header: "Status", accessor: "status" }
  ];

  const data = [
    {
      id: 1,
      name: "John Doe",
      department: "IT",
      status: "Pending",
      isUnread: true // 🔵 unread row
    },
    {
      id: 2,
      name: "Sarah Jane",
      department: "Finance",
      status: "Approved",
      isUnread: false
    }
  ];

  return (
    <div className="p-4">
      <SmartTable
        columns={columns}
        data={data}
        selectable
        selectedRows={selectedRows}
        onSelectRow={(id: string | number) => {
          setSelectedRows((prev) =>
            prev.includes(id)
              ? prev.filter((x) => x !== id)
              : [...prev, id]
          );
        }}
        onSelectAll={(checked: boolean) => {
          setSelectedRows(checked ? data.map((d) => d.id) : []);
        }}
        showActions
        onEdit={(row: unknown) => console.log("Edit:", row)}
        onDelete={(row:unknown) => console.log("Delete:", row)}
        onReassign={(row:unknown) => console.log("Reassign:", row)}
      />
    </div>
  );
}

export default Table2;

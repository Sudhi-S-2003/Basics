import React, { useState, useRef, useEffect } from "react";
import {
  MoreVertical,
  ArrowUpDown,
  Pencil,
  Trash2,
  Users
} from "lucide-react";

const SmartTable = ({
  columns = [],
  data = [],
  selectable = false,
  selectedRows = [],
  onSelectRow,
  onSelectAll,
  showActions = false,
  onEdit,
  onDelete,
  onReassign,
  unreadKey = "isUnread",
  rowIdKey = "id",
  customMenu: CustomMenuComponent,
  loading = false
}) => {
  const [menuRow, setMenuRow] = useState(null);
  const [menuCoords, setMenuCoords] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const closeMenu = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuRow(null);
      }
    };
    document.addEventListener("mousedown", closeMenu);
    return () => document.removeEventListener("mousedown", closeMenu);
  }, []);

  const toggleMenu = (row, e) => {
    e.stopPropagation();
    const rowId = row[rowIdKey];

    setMenuCoords({
      top: e.clientY,
      left: e.clientX - 160
    });

    setMenuRow((prev) => (prev === rowId ? null : rowId));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40 text-base-600 text-sm">
        ⏳ Loading...
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-base-300">
      <table className="table-auto min-w-full border-collapse text-left">
        <thead>
          <tr className="border-b bg-base-200 text-base-600 text-sm">
            {selectable && (
              <th className="pl-4">
                <input
                  type="checkbox"
                  checked={selectedRows.length === data.length && data.length > 0}
                  onChange={(e) => onSelectAll?.(e.target.checked)}
                />
              </th>
            )}

            {columns.map((col, i) => (
              <th key={i} className="px-3 py-2 font-medium whitespace-nowrap">
                <div className="flex items-center gap-1">
                  {col.header}
                  {col.sortable && (
                    <ArrowUpDown size={14} className="text-base-400" />
                  )}
                </div>
              </th>
            ))}

            {showActions && <th className="px-3 py-2 w-10" />}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 && (
            <tr>
              <td
                colSpan={
                  columns.length +
                  (selectable ? 1 : 0) +
                  (showActions ? 1 : 0)
                }
                className="text-center py-5 text-base-500"
              >
                No records found
              </td>
            </tr>
          )}

          {data.map((row, index) => {
            const rowId = row[rowIdKey] ?? index;
            const isUnread = row[unreadKey] === true;

            return (
              <tr
                key={rowId}
                className={`
                  border-b border-base-200 cursor-pointer transition
                  ${isUnread ? "bg-blue-50 font-semibold" : "bg-white"}
                  hover:bg-base-100
                `}
              >
                {selectable && (
                  <td className="pl-4">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(rowId)}
                      onChange={() => onSelectRow?.(rowId)}
                    />
                  </td>
                )}

                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-3 py-3 text-sm text-base-800 relative"
                  >
                    {/* 🔵 Unread Dot */}
                    {colIndex === 0 && isUnread && (
                      <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-600 rounded-full"></span>
                    )}

                    {col.render
                      ? col.render(row[col.accessor], row)
                      : row[col.accessor]}
                  </td>
                ))}

                {/* Actions */}
                {showActions && (
                  <td className="px-3 text-right relative">
                    <MoreVertical
                      size={18}
                      className="text-base-500 cursor-pointer hover:text-base-800"
                      onClick={(e) => toggleMenu(row, e)}
                    />

                    {menuRow === rowId && (
                      <div
                        ref={menuRef}
                        className="fixed z-50 w-40 bg-white rounded-md shadow-lg border border-base-300"
                        style={{
                          top: `${menuCoords.top}px`,
                          left: `${menuCoords.left}px`
                        }}
                      >
                        {onEdit && (
                          <button
                            className="flex items-center px-4 py-2 text-sm hover:bg-base-100 w-full text-left"
                            onClick={() => {
                              onEdit(row);
                              setMenuRow(null);
                            }}
                          >
                            <Pencil size={16} className="mr-2" /> Edit
                          </button>
                        )}

                        {onDelete && (
                          <button
                            className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-base-100 w-full text-left"
                            onClick={() => {
                              onDelete(row);
                              setMenuRow(null);
                            }}
                          >
                            <Trash2 size={16} className="mr-2" /> Delete
                          </button>
                        )}

                        {onReassign && (
                          <button
                            className="flex items-center px-4 py-2 text-sm hover:bg-base-100 w-full text-left"
                            onClick={() => {
                              onReassign(row);
                              setMenuRow(null);
                            }}
                          >
                            <Users size={16} className="mr-2" /> Reassign
                          </button>
                        )}

                        {CustomMenuComponent && (
                          <CustomMenuComponent
                            row={row}
                            closeMenu={() => setMenuRow(null)}
                          />
                        )}
                      </div>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SmartTable;

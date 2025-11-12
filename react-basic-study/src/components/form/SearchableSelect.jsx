"use client";

import { useEffect, useState, useRef } from "react";
import useDebounce from "../../hook/form/debounce";

/**
 * Searchable and creatable dropdown select.
 *
 * @param {Object} props
 * @param {string} props.value - Selected option ID or value.
 * @param {(val: any) => void} props.onSelect - Called when an option is selected or created.
 * @param {string} [props.placeholder="Select or search..."]
 * @param {boolean} [props.allowCreate=true]
 * @param {boolean} [props.disabled=false]
 * @param {string} [props.error]
 * @param {(params: { search: string }) => Promise<any[]>} props.getOption - Fetch function for options.
 * @param {(params: { value: string }) => Promise<any>} props.createOption - Create function for new option.
 */
export default function SearchableSelect({
  value,
  onSelect,
  placeholder = "Select or search...",
  allowCreate = true,
  disabled = false,
  error,
  getOption = async () => [],
  createOption = async () => {},
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const dropdownRef = useRef(null);
  const debouncedSearch = useDebounce(searchQuery, 400);

  // Selected option label
  const selectedOption = options.find((opt) => opt._id === value);
  const displayValue = selectedOption?.value || placeholder;

  // Fetch options safely
  useEffect(() => {
    let active = true;
    const fetchOptions = async () => {
      if (!getOption) return;
      setLoading(true);
      try {
        const data = await getOption({ search: debouncedSearch });
        if (active) setOptions(Array.isArray(data) ? data.filter(Boolean) : []);
      } catch (err) {
        console.error("Error fetching options:", err);
        if (active) setOptions([]);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchOptions();
    return () => {
      active = false;
    };
  }, [debouncedSearch, getOption]);

  // Create new option
  const handleCreate = async () => {
    if (!allowCreate || !searchQuery.trim()) return;
    setLoading(true);
    try {
      const newData = await createOption({ value: searchQuery.trim() });
      if (newData) {
        onSelect(newData);
        setSearchQuery("");
        setIsOpen(false);
      }
    } catch (err) {
      console.error("Error creating option:", err);
    } finally {
      setLoading(false);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown button */}
      <div
        className={`w-full border rounded-md px-3 py-2 text-sm flex justify-between items-center transition-all duration-150 ${
          disabled
            ? "opacity-50 cursor-not-allowed bg-gray-100"
            : "cursor-pointer hover:border-gray-400"
        } ${error ? "border-red-400" : "border-gray-300"}`}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
      >
        <span className={value ? "text-gray-800" : "text-gray-400"}>
          {displayValue}
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {/* Dropdown content */}
      {isOpen && !disabled && (
        <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
          {/* Search field */}
          <div className="p-2 border-b">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              placeholder="Search or create..."
              className="w-full border rounded-md px-3 py-1 text-sm focus:ring-1 focus:ring-gray-300 focus:outline-none"
            />
          </div>

          {/* Option list */}
          {loading ? (
            <div className="flex justify-center items-center py-3">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-sm text-gray-600">Loading...</span>
            </div>
          ) : options.length > 0 ? (
            options.map((opt) => (
              <div
                key={opt._id}
                onClick={() => {
                  onSelect(opt);
                  setSearchQuery("");
                  setIsOpen(false);
                }}
                className={`px-3 py-2 cursor-pointer transition-colors duration-100 ${
                  value === opt._id
                    ? "bg-gray-200 text-gray-800"
                    : "hover:bg-gray-100"
                }`}
              >
                {opt.value}
              </div>
            ))
          ) : allowCreate && searchQuery.trim() ? (
            <div
              className="px-3 py-2 cursor-pointer text-blue-600 hover:bg-blue-50"
              onClick={handleCreate}
            >
              Create “{searchQuery}”
            </div>
          ) : (
            <div className="p-3 text-sm text-gray-400 text-center">
              No options found
            </div>
          )}
        </div>
      )}

      {/* Error message */}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

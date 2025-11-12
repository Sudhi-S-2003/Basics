function Select({ options = [], className = "", ...props }) {
  return (
    <select
      className={`w-full border border-gray-300 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 ${className}`}
      {...props}
    >
      {options.length > 0
        ? options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))
        : [
            <option key="option1" value="option1">
              Option 1
            </option>,
            <option key="option2" value="option2">
              Option 2
            </option>,
            <option key="option3" value="option3">
              Option 3
            </option>,
          ]}
    </select>
  );
}

export default Select;

function TextArea({ placeholder = "Enter your text here", className = "", rows = 4, ...props }) {
  return (
    <textarea
      placeholder={placeholder}
      rows={rows}
      className={`w-full border border-gray-300 rounded-md p-2 text-gray-700 resize-y focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 ${className}`}
      {...props}
    />
  );
}

export default TextArea;

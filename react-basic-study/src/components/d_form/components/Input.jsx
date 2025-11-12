function Input({ type = "text", placeholder = "Enter text here", className = "", ...props }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={`w-full border border-gray-300 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 ${className}`}
      {...props}
    />
  );
}

export default Input;

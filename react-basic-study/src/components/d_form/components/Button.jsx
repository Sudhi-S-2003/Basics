function Button({ children = "Click Me", color = "blue", className = "", ...props }) {
  // Define Tailwind color classes dynamically
  const colors = {
    blue: "bg-blue-500 hover:bg-blue-600 text-white",
    gray: "bg-gray-500 hover:bg-gray-600 text-white",
    red: "bg-red-500 hover:bg-red-600 text-white",
    green: "bg-green-500 hover:bg-green-600 text-white",
  };

  const colorClass = colors[color] || colors.blue;

  return (
    <button
      className={`px-4 py-2 rounded-md font-semibold transition-colors duration-200 ${colorClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;

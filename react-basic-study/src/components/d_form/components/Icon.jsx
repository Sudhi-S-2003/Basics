// Icons.jsx
import React from "react";
import * as LucideIcons from "lucide-react";

/**
 * Icons component dynamically renders Lucide icons by name
 * @param {string} name - Name of the Lucide icon (e.g. "User", "Home")
 * @param {object} props - Props to pass to the icon (size, color, etc.)
 */
function Icon({ name, ...props }) {
  const IconComponent = LucideIcons[name];

  if (!IconComponent) {
    return <span>Icon not found</span>;
  }

  return <IconComponent {...props} />;
}

export default Icon;

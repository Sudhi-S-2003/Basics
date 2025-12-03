import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef(({ className, checked, ...props }, ref) => {
  return (
    <div className="relative inline-flex items-center">
      <input
        type="checkbox"
        className="peer sr-only"
        ref={ref}
        checked={checked}
        {...props}
      />
      <div
        className={cn(
          "h-5 w-5 shrink-0 rounded border border-input ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          "peer-checked:bg-primary peer-checked:border-primary peer-checked:text-primary-foreground",
          "cursor-pointer transition-colors",
          className
        )}
      >
        {checked && (
          <Check className="h-4 w-4 text-current" strokeWidth={3} />
        )}
      </div>
    </div>
  );
});
Checkbox.displayName = "Checkbox";

export { Checkbox };
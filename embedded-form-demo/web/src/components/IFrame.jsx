import { useState } from "react";
import { cn } from "@/lib/utils";

const IFrame = ({ formUrl }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden",
        "bg-card rounded-lg shadow-xl border border-border",
        "transition-all duration-300"
      )}
      style={{ height: "100vh" }}
    >
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          Loading…
        </div>
      )}

      <iframe
        src={formUrl}
        onLoad={() => setIsLoaded(true)}
        title="Contact Form"
        className={cn(
          "w-full h-full border-0 transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        sandbox="allow-scripts allow-same-origin allow-forms"
        loading="lazy"
      />
    </div>
  );
};

export default IFrame;

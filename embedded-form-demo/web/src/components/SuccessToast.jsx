import { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SuccessToast({ data, onClose }) {
  useEffect(() => {
    // Auto-dismiss after 8 seconds
    const timer = setTimeout(onClose, 8000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 max-w-md w-full",
        "bg-card border border-border rounded-lg shadow-2xl",
        "animate-in slide-in-from-top-5 fade-in duration-300"
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-card-foreground mb-1">
              Form Submitted Successfully!
            </h3>
            <p className="text-sm text-muted-foreground mb-2">
              Thank you for contacting us. We've received your message.
            </p>
            
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">Name:</span> {data.name}
              </p>
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">Email:</span> {data.email}
              </p>
              {data.subscribe && (
                <p className="text-xs text-green-600 dark:text-green-400">
                  ✓ Subscribed to newsletter
                </p>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className={cn(
              "flex-shrink-0 rounded-md p-1.5",
              "text-muted-foreground hover:text-foreground",
              "hover:bg-accent transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
            aria-label="Close notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
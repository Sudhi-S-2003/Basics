import { useState, useEffect, useRef } from 'react';
import { ExternalLink, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function EmbedCard({ formUrl, theme, onFormSubmit }) {
  const [iframeHeight, setIframeHeight] = useState(600); // Default height
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const iframeRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // SECURITY NOTE: In production, verify event.origin matches the iframe domain
    // Replace the origin check with your specific iframe domain
    const handleMessage = (event) => {
      // Example security check (uncomment and modify for production):
      // if (event.origin !== "https://your-form-domain.com") return;
      
      if (event.data.type === 'form-height') {
        setIframeHeight(event.data.height);
        setHasError(false);
        // Clear the timeout since we received a message
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      } else if (event.data.type === 'form-submitted') {
        onFormSubmit(event.data.data);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [onFormSubmit]);

  const handleIframeLoad = () => {
    setIsLoaded(true);
    
    // Send theme to iframe
    if (iframeRef.current && iframeRef.current.contentWindow) {
      // SECURITY NOTE: Replace "*" with specific iframe origin in production
      iframeRef.current.contentWindow.postMessage(
        { type: 'theme-change', theme },
        '*' // Replace with iframe origin, e.g., 'https://your-form-domain.com'
      );
    }

    // Set timeout to show error if no messages received within 3 seconds
    timeoutRef.current = setTimeout(() => {
      setHasError(true);
      setIframeHeight(800); // Fallback height
    }, 3000);
  };

  // Update theme in iframe when it changes
  useEffect(() => {
    if (isLoaded && iframeRef.current && iframeRef.current.contentWindow) {
      // SECURITY NOTE: Replace "*" with specific iframe origin in production
      iframeRef.current.contentWindow.postMessage(
        { type: 'theme-change', theme },
        '*' // Replace with iframe origin
      );
    }
  }, [theme, isLoaded]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Error Banner */}
      {hasError && (
        <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Having trouble loading the form?{' '}
                <a
                  href={formUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-medium hover:underline"
                >
                  Open in new tab
                  <ExternalLink className="h-3 w-3" />
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Iframe Container */}
      <div
        className={cn(
          "relative w-full overflow-hidden",
          "bg-card rounded-lg shadow-xl border border-border",
          "transition-all duration-300"
        )}
      >
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-muted-foreground">Loading form...</p>
            </div>
          </div>
        )}

        <iframe
          ref={iframeRef}
          src={formUrl}
          onLoad={handleIframeLoad}
          title="Contact Form"
          className={cn(
            "w-full border-0 transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
          style={{ height: `${iframeHeight}px` }}
          // Security attributes
          sandbox="allow-scripts allow-same-origin allow-forms"
          loading="lazy"
        />
      </div>

      {/* Info Text */}
      <p className="mt-3 text-xs text-center text-muted-foreground">
        This form is securely embedded from our form provider
      </p>
    </div>
  );
}
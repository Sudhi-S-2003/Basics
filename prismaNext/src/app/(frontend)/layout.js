import { Toaster } from "sonner";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        {/* Global toaster */}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}

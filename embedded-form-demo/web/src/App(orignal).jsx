import { useState, useEffect } from 'react';
import EmbedCard from './components/EmbedCard';
import ThemeToggle from './components/ThemeToggle';
import SuccessToast from './components/SuccessToast';

function App() {
  const [theme, setTheme] = useState('light');
  const [submittedData, setSubmittedData] = useState(null);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
    
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleFormSubmit = (data) => {
    setSubmittedData(data);
  };

  const closeToast = () => {
    setSubmittedData(null);
  };

  // IMPORTANT: Change this URL to your deployed Site 1 domain in production
  // For local testing: "http://localhost:5173/form"
  // For production: "https://your-site1-domain.com/form"
  const formUrl = "http://localhost:5173/form";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Company Name</h1>
              <p className="text-sm text-muted-foreground">Get in touch with us</p>
            </div>
            <ThemeToggle theme={theme} onThemeChange={handleThemeChange} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-foreground">Contact Us</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have a question or want to work together? Fill out the form below and we'll get back to you as soon as possible.
          </p>
        </div>

        {/* Embedded Form */}
        <EmbedCard 
          formUrl={formUrl}
          theme={theme}
          onFormSubmit={handleFormSubmit}
        />

        {/* Additional Info Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2 text-foreground">Email Us</h3>
            <p className="text-sm text-muted-foreground">contact@example.com</p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2 text-foreground">Call Us</h3>
            <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2 text-foreground">Visit Us</h3>
            <p className="text-sm text-muted-foreground">123 Business St, Suite 100</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-20">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-sm text-muted-foreground">
            © 2024 Company Name. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Success Toast */}
      {submittedData && (
        <SuccessToast data={submittedData} onClose={closeToast} />
      )}
    </div>
  );
}

export default App;
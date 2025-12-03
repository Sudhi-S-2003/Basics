import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ThemeToggle({ theme, onThemeChange }) {
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    onThemeChange(newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative inline-flex items-center justify-center rounded-lg p-2.5",
        "bg-secondary hover:bg-accent transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      )}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Sun className="h-5 w-5 text-foreground" />
      ) : (
        <Moon className="h-5 w-5 text-foreground" />
      )}
    </button>
  );
}
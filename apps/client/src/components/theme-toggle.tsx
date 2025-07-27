import { Button } from '@repo/ui/button';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="secondary" size="small" className="h-8 min-w-8 p-1">
        🌙
      </Button>
    );
  }

  const handleToggle = () => {
    if (theme === 'system') {
      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
    } else if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  const getIcon = () => {
    if (theme === 'system') {
      return '🖥️';
    }
    return resolvedTheme === 'dark' ? '🌙' : '☀️';
  };

  const getTooltip = () => {
    if (theme === 'system') {
      return `System (${resolvedTheme === 'dark' ? 'Dark' : 'Light'})`;
    }
    return theme === 'light' ? 'Light Mode' : 'Dark Mode';
  };

  return (
    <Button
      variant="secondary"
      size="small"
      onClick={handleToggle}
      title={getTooltip()}
      className="h-8 min-w-8 p-1"
    >
      {getIcon()}
    </Button>
  );
}

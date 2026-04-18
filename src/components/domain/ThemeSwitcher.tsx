import { Monitor, Moon, Sun } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useTheme } from '@/lib/theme-provider';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="grid gap-2 rounded-xl border border-border/70 p-3">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Theme
      </p>
      <div className="grid gap-2">
        <Button
          variant={theme === 'light' ? 'default' : 'outline'}
          onClick={() => setTheme('light')}
          aria-pressed={theme === 'light'}
        >
          <Sun />
          Light
        </Button>
        <Button
          variant={theme === 'dark' ? 'default' : 'outline'}
          onClick={() => setTheme('dark')}
          aria-pressed={theme === 'dark'}
        >
          <Moon />
          Dark
        </Button>
        <Button
          variant={theme === 'system' ? 'default' : 'outline'}
          onClick={() => setTheme('system')}
          aria-pressed={theme === 'system'}
        >
          <Monitor />
          System
        </Button>
      </div>
    </div>
  );
}

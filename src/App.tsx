import { useState } from 'react'
import './App.css'
import { Button } from './components/ui/button';
import { ThemeProvider, useTheme } from './lib/theme-provider';

function ThemeControls() {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <p>Current {theme}</p>
      <div className="flex gap-3">
        <Button variant={'outline'} onClick={() => setTheme('light')}>Light Theme</Button>
        <Button onClick={() => setTheme('dark')}>Dark Theme</Button>
        <Button onClick={() => setTheme('system')}>System Theme</Button>
      </div>
    </>
  );
}

function App() {
  const [count, setCount] = useState(0);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="zad-theme">
      <div className="flex min-h-svh flex-col items-center justify-center gap-3 bg-background text-primary">
        <Button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </Button>
        <ThemeControls />
      </div>
    </ThemeProvider>
  );
}

export default App

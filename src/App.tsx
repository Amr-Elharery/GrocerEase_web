import './App.css';
import { AppRoutes } from './routes/AppRoutes';
import { ThemeProvider } from './lib/theme-provider';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="zad-theme">
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;

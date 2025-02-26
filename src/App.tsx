import './App.css';
import Router from './routes/Router';
import { useRoutes } from 'react-router-dom';

function App() {
  // Configurare le rotte usando useRoutes
  const routing = useRoutes(Router);

  return (
    <>
      {routing}
    </>
  );
}

export default App;

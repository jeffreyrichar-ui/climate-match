import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { PhilosophyApp } from './PhilosophyApp';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PhilosophyApp />
  </StrictMode>,
);

import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { FaithApp } from './FaithApp';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FaithApp />
  </StrictMode>,
);

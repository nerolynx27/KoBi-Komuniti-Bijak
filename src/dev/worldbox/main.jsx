import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { WorldboxApp } from './WorldboxApp.jsx';
import '../../styles/tokens.css';
import '../../styles/app.css';
import '../../styles/components.css';
import './worldbox.css';

createRoot(document.getElementById('worldbox-root')).render(
  <StrictMode>
    <WorldboxApp />
  </StrictMode>
);

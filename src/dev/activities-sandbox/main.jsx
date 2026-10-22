import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ActivitiesSandboxApp from './ActivitiesSandboxApp.jsx';
import '../../styles/tokens.css';
import '../../styles/app.css';
import '../../styles/components.css';
import '../reports-sandbox/reports-sandbox.css';
import './activities-sandbox.css';

createRoot(document.getElementById('sandbox-root')).render(
  <StrictMode>
    <ActivitiesSandboxApp />
  </StrictMode>
);

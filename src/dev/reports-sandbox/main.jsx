import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ReportsSandboxApp from './ReportsSandboxApp.jsx';
import '../../styles/tokens.css';
import '../../styles/app.css';
import '../../styles/components.css';
import './reports-sandbox.css';

createRoot(document.getElementById('sandbox-root')).render(
  <StrictMode>
    <ReportsSandboxApp />
  </StrictMode>
);

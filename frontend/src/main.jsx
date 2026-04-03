import React from 'react';
import ReactDOM from 'react-dom/client';
import SmartHireApp from './App';
import { I18nProvider } from '@/lib/i18n-context';
import './app/globals.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <I18nProvider>
      <SmartHireApp />
    </I18nProvider>
  </React.StrictMode>
);
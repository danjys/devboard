/**
 * src/renderer/main.jsx — React entry point
 */

import React    from 'react';
import ReactDOM from 'react-dom/client';

import App                  from './App';
import { TaskProvider }     from './context/TaskContext';
import { ToastProvider }    from './context/ToastContext';

import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TaskProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </TaskProvider>
  </React.StrictMode>
);

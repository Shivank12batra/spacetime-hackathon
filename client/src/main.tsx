import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { SpacetimeDBProvider } from 'spacetimedb/react';
import { DbConnection } from './module_bindings';
import { App } from './App';
import { ErrorBoundary } from './ErrorBoundary';
import './noticeboard.css';

const host = import.meta.env.VITE_SPACETIME_URI ?? 'http://127.0.0.1:3000';
const dbName = import.meta.env.VITE_SPACETIME_DB ?? 'kingmaker';
const seatKey = new URLSearchParams(window.location.search).get('as') || 'default';
const tokenKey = `campus_whispers_token_${seatKey}`;

const connectionBuilder = DbConnection.builder()
  .withUri(host)
  .withDatabaseName(dbName)
  .withToken(localStorage.getItem(tokenKey) || undefined)
  .onConnect((_connection, _identity, token) => {
    localStorage.setItem(tokenKey, token);
  })
  .onConnectError((_ctx, error) => {
    console.error('SpacetimeDB connection failed', error);
  });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <SpacetimeDBProvider connectionBuilder={connectionBuilder}>
        <App />
      </SpacetimeDBProvider>
    </ErrorBoundary>
  </StrictMode>
);

import { loadConfig } from './config.ts';
import { Backend } from './backend.ts';
import { Store } from './store.ts';

let backend: Backend | undefined;

export function getBackend(): Backend {
  if (backend) return backend;
  const config = loadConfig(process.env);
  const store = new Store(config.databasePath);
  backend = new Backend(store, config);
  return backend;
}

/** Test-only escape hatch so isolated tests can reset the singleton. */
export function resetBackendForTests() {
  backend = undefined;
}

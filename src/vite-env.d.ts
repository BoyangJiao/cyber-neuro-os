/// <reference types="vite/client" />

// Injected at build time from package.json `version` via vite.config.ts `define`.
// Single source of truth for the app version shown in the UI (SettingsModal,
// BootScreen). Bump package.json on a production release → both update.
declare const __APP_VERSION__: string;

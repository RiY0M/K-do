/// <reference types="vite/client" />

declare module "*.svg" {
  export const content: string;
}

declare module "*.css" {
  export const content: string;
}

// Constantes injectées par `define` dans vite.config.ts (remplacées au build)
declare const __APP_NAME__: string;
declare const __APP_VERSION__: string;
declare const __AUTHOR_NAME__: string;

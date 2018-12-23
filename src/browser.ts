import createAmbient from './ambient';
import './react';

declare global {
  interface Window {
    createAmbient: any;
  }
}

window.createAmbient = createAmbient;

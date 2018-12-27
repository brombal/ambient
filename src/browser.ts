import createAmbient from './index';
import './react';

declare global {
  interface Window {
    createAmbient: any;
  }
}

window.createAmbient = createAmbient;

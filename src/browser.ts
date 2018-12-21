import Ambient, { AmbientSubscriber, withAmbient } from './ambient';

declare global {
  interface Window {
    Ambient: any;
  }
}

window.Ambient = Ambient;
window.Ambient.AmbientSubscriber = AmbientSubscriber;
window.Ambient.withAmbient = withAmbient;

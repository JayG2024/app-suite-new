import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initSentry } from './utils/sentry'

// Initialize Sentry before rendering the app
initSentry();

const container = document.getElementById("root")!;
const root = createRoot(container);
root.render(<App />);

// Dispatch render event for prerendering
setTimeout(() => {
  document.dispatchEvent(new Event('render-event'));
}, 1000);

import ReactDOM from 'react-dom/client';
import App from './App.tsx'
import './styles/globals.css';

async function prepare() {
  if (import.meta.env.DEV) {
    try {
      const { worker } = await import('./lib/msw/browser');
      await worker.start({
        onUnhandledRequest: 'bypass',
      });
    } catch (error) {
      console.warn('MSW initialization failed:', error);
    }
  }
}

prepare().then(() => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }
  ReactDOM.createRoot(rootElement).render(<App />);
}).catch((error) => {
  console.error('Failed to start application:', error);
});

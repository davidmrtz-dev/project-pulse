import ReactDOM from 'react-dom/client';
import App from './App.tsx'
import './styles/globals.css';
import { I18nProvider } from './i18n/I18nProvider';

async function prepare() {
  try {
    const { worker } = await import('./lib/msw/browser');
    await worker.start({
      onUnhandledRequest: 'bypass',
    });
  } catch (error) {
    console.warn('MSW initialization failed:', error);
  }
}

prepare().then(() => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }
  ReactDOM.createRoot(rootElement).render(
    <I18nProvider>
      <App />
    </I18nProvider>
  );
}).catch((error) => {
  console.error('Failed to start application:', error);
});

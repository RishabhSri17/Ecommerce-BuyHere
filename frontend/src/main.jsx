import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/styles/index.css';
import Routes from './routes/Routes';
import store from './store';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <Routes />
      </Provider>
    </HelmetProvider>
  </React.StrictMode>
);



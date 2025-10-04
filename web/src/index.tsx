import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { StoreContext, store } from './store/Store';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StoreContext.Provider value={store}>
    <GoogleOAuthProvider clientId="552266780451-8jisepinrk0l7b0oesifek1lsdn9aou1.apps.googleusercontent.com" >
      <BrowserRouter>
        <App />
      </BrowserRouter>

    </GoogleOAuthProvider>
  </StoreContext.Provider>
);


reportWebVitals();

import { ChakraProvider } from '@chakra-ui/react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';

import { router } from '../src/routes';
import { theme } from '../src/theme';
import { App } from './App.jsx';
import { store } from './app/store.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <Provider store={store}>
    <ChakraProvider theme={theme}>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </ChakraProvider>
  </Provider>
  // </React.StrictMode>,
);

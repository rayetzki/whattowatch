import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ChakraProvider } from "@chakra-ui/react";
import { system } from "@chakra-ui/react/preset";
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChakraProvider value={system}>
      <App />
    </ChakraProvider>
  </StrictMode>,
);

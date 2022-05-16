import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, Heading } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ChakraProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Heading>SSChat</Heading>} />
        <Route path="/login" element={ <Login /> } />
      </Routes>
    </BrowserRouter>
  </ChakraProvider>
);
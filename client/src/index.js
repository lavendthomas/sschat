import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, Heading } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ChakraProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Heading>SSChat</Heading>} />
        <Route path="/login" element={ <Login /> } />
        <Route path="/signup" element={ <Signup /> } />
        <Route path="*" element={<Heading>404</Heading>} />
      </Routes>
    </BrowserRouter>
  </ChakraProvider>
);
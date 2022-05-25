import React from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider, Heading } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import Chat from './Chat';

const container = document.getElementById('root');
const root = createRoot(container);

const password = {
  password: "",
};

root.render(
  <ChakraProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <Login password={password} /> } />
        <Route path="/chat" element={<Chat password={password}/>} />
        <Route path="/signup" element={ <Signup password={password} /> } />
        <Route path="*" element={<Heading>404</Heading>} />
      </Routes>
    </BrowserRouter>
  </ChakraProvider>
);
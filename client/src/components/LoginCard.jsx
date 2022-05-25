import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Text,
  Link
} from '@chakra-ui/react';
import getCsrfToken, { clearCsrfToken } from "../Utils";

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { PGP_KEY_PASSWORD, CHAT_STORAGE } from "./../Chat";
import ChatStorage from "../core/ChatStorage";
import { GLOBALS } from "../core/GlobalVariables";

export default function LoginCard(props) {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    getCsrfToken().then(csrfToken => {
        e.preventDefault();
        GLOBALS.PGP_KEY_PASSWORD = password; // Store the password in a global variable so that the chat can decrypt the messages
        props.password.password = password
        localStorage.setItem("whoami", username);
        fetch("http://localhost:8000/msg/sign_in", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "*/*",
                "X-CSRFToken": csrfToken,
                },
            credentials: "include",
            body: JSON.stringify({
                user: username,
                password: password,
                }),
            })
            .then(res => res.json())
            .then(data => {
                console.debug(data);
                clearCsrfToken();
                navigate("/chat");
            }
        );
    }, []);
  };

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
    >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Box
          rounded={'lg'}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4}>
            <FormControl id="username">
              <FormLabel>Username</FormLabel>
              <Input type="username" focusBorderColor='gray.400' onChange={e => setUsername(e.currentTarget.value)} />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input type="password" focusBorderColor='gray.400' onChange={e => setPassword(e.currentTarget.value)}/>
            </FormControl>
            <Stack spacing={10}>
              <Button
                width={'5em'}
                alignSelf={'center'}
                type="submit"
                onClick={handleSubmit}
                _hover={{
                  bg: 'gray.200',
                }}>
                Sign in
              </Button>
            </Stack>
            <Text>Don't have an account yet ?  {' '} <Link onClick={() => navigate("/signup")}>Register here</Link>.</Text>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
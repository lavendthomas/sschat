import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
} from '@chakra-ui/react';
import getCsrfToken from "../Utils";

import { useState } from 'react';

export default function SimpleCard() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loggedIn, setLoggedIn] = useState(false);

  const handleSubmit = (e) => {
    getCsrfToken().then(csrfToken => {
        e.preventDefault();
        fetch("http://localhost:8000/msg/sign_in", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "*/*",
                "X-CSRFToken": csrfToken,
                },
            credentials: "include",
            body: JSON.stringify({
                user: email,
                password: password,
                }),
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setLoggedIn(true);
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
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input type="email" focusBorderColor='gray.400' onChange={e => setEmail(e.currentTarget.value)} />
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
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
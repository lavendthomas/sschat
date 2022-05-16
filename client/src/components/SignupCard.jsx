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
  
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as openpgp from 'openpgp';

export const WEBSTORAGE_KEYPAIR_ENTRY = 'keypair';
  
export default function SimpleCard() {
  
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        openpgp.generateKey({
            type: 'ecc', // Type of the key, defaults to ECC
            curve: 'curve25519', // ECC curve name, defaults to curve25519
            userIDs: [{name: email, email: email}], 
            passphrase: password,
            format: 'armored'},)
        .then((key) => {
            console.log(key);
            console.log(email, password);

            // Store the web using WebStorage
            localStorage.setItem(WEBSTORAGE_KEYPAIR_ENTRY, JSON.stringify(key));
            console.debug("Stored keypair in localStorage");

            // Register with out new public key
            fetch("http://localhost:8000/msg/sign_up", {
              method: "POST",
              body: JSON.stringify({
                  user: email,
                  password: password,
                  public_pgp_key: key.publicKey,
                  }),
              })
            .then(response => response.json())
            .then(data => {
                console.log(data);
            }
        );
        })

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
                  Sign up
                </Button>
              </Stack>
              <Text>Already have an account ?  {' '} <Link onClick={() => navigate("/login")}>Login here</Link>.</Text>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    );
}
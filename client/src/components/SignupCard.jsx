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
  
  export default function SimpleCard() {
  
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(email, password);
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
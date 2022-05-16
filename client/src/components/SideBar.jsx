import React from 'react';
import {
  Box,
  useColorModeValue,
  Text,
  Center,
  Link,
  Circle,
  HStack
} from '@chakra-ui/react';

const FriendList = [
  { name: 'John Doe', status: 'online' },
  { name: 'Jane Doe', status: 'offline' },
  { name: 'Jack Doe', status: 'online' },
]

const StatusCircle = ({ status }) => {
  const bgOnline = useColorModeValue('green.500', 'green.200');
  const bgOffline = useColorModeValue('red.500', 'red.200');
  const bg = status === 'online' ? bgOnline : bgOffline;
  return (
    <Circle size="12px" bg={bg} margin={'5px'} />
  )
};

export default function Sidebar(){
  const bg = useColorModeValue('gray.100', 'gray.700');
  return (
    <Box
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      padding={'1em'}
      h="full">
      <Center>
        <Text fontSize="2xl" fontWeight="bold" paddingBottom={'1em'}>
          Friend List
        </Text>
      </Center>

      {FriendList.map((friend) => (
        <Center key={friend.name}>
          <Link
            _hover={{ bg: bg }}>
              <HStack><Text>{friend.name}</Text><StatusCircle status={friend.status}/></HStack>
          </Link>
        </Center>
      ))}
    </Box>
  );
};
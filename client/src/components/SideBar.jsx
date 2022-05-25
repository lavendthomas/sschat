import React from "react";
import { useEffect, useState } from "react";
import getCsrfToken from "../Utils";
import { PublicKeyStorage } from "../core/PublicKeyStorage";
import FriendsList from "./FriendsList";

import { useNavigate } from "react-router-dom";

import {
  Box,
  useColorModeValue,
  Text,
  Center,
  Link,
  Circle,
  HStack,
  Button,
  VStack,
} from "@chakra-ui/react";

import { LockIcon } from "@chakra-ui/icons";

// const FriendList = [
//   { name: 'John Doe', status: 'online' },
//   { name: 'Jane Doe', status: 'offline' },
//   { name: 'Jack Doe', status: 'online' },
// ]

const StatusCircle = ({ status }) => {
  const bgOnline = useColorModeValue("green.500", "green.200");
  const bgOffline = useColorModeValue("red.500", "red.200");
  const bg = status === "online" ? bgOnline : bgOffline;
  return <Circle size="12px" bg={bg} margin={"5px"} />;
};

export default function Sidebar(props) {
  const bg = useColorModeValue("gray.100", "gray.700");

  const navigate = useNavigate();

  const [user, setUser] = useState(localStorage.getItem("whoami"));
  const [securityCode, setSecurityCode] = useState("");

  useEffect(() => {
    PublicKeyStorage.getSecurityCode(user).then(
      (code) => {
        setSecurityCode(code);
      }
    )
  }, [user])

  return (
    <Box
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      padding={"1em"}
      h="full"
    > 
      <HStack>
        <Text>{user}#{securityCode}</Text  >
        <Button
          leftIcon={<LockIcon />}
          onClick={() => {
            props.setSelectedUser(null);
            localStorage.removeItem("whoami");
            navigate("/");
          }}
        >
          Logout
        </Button>
      </HStack>
      <FriendsList setSelectedUser={props.setSelectedUser} />
    </Box>
  );
}

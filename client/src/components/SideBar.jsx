import React from "react";
import { useEffect, useState } from "react";
import getCsrfToken, { API_HOST } from "../Utils";
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
  Heading,
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

  const signOut = () => {
    getCsrfToken().then((csrfToken) => {
      fetch(`${API_HOST}/msg/sign_out`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken,
        },
      })
        .then((res) => {
          if (res.status === 200) {
            props.setSelectedUser(null);
            localStorage.removeItem("whoami");
            navigate("/");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };

  useEffect(() => {
    PublicKeyStorage.getSecurityCode(user).then((code) => {
      setSecurityCode(code);
    });
  }, [user]);

  return (
    <Box
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      padding={"1em"}
      h="full"
    >
      <Button
        leftIcon={<LockIcon />}
        onClick={() => {
          signOut();
        }}
      >
        Logout
      </Button>
      <Center paddingTop={"1em"} paddingBottom={"1em"}>
        <HStack>
          <Text fontSize="xl">{user}</Text>
          <Text fontSize="sm">#{securityCode}</Text>
        </HStack>
      </Center>
      <FriendsList setSelectedUser={props.setSelectedUser} />
    </Box>
  );
}

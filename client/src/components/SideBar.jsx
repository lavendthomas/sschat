import React from "react";
import { useEffect, useState } from "react";
import getCsrfToken, { API_HOST } from "../Utils";
import { PublicKeyStorage } from "../core/PublicKeyStorage";
import FriendsList from "./FriendsList";
import { PasswordModal } from "./PasswordModal";

import { useNavigate } from "react-router-dom";

import {
  Box,
  Text,
  Center,
  HStack,
  Button,
  useDisclosure,
} from "@chakra-ui/react";

import { LockIcon, DeleteIcon } from "@chakra-ui/icons";

/**
 * This component is responsible for rendering the sidebar. It is
 * responsible for displaying the friends list as well as the
 * two buttons that are used to signout and remove the account.
 * @param {*} props
 * @returns
 */
export default function Sidebar(props) {
  const navigate = useNavigate();
  const user = localStorage.getItem("whoami");
  const [securityCode, setSecurityCode] = useState("");
  const [password, setPassword] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: false });

  /**
   * This function is responsible for signing out the user.
   * It is called when the user clicks the signout button.
   */
  const signOut = () => {
    getCsrfToken().then((csrfToken) => {
      fetch(`${API_HOST}/msg/sign_out`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFTOKEN": csrfToken,
        },
        credentials: "include",
      })
        .then((res) => {
          if (res.status === 200) {
            props.setSelectedUser(null);
            localStorage.removeItem("whoami");
            navigate("/");
          }
        })
        .catch((err) => {});
    });
  };

  /**
   * This function is responsible for removing the user's account.
   * It is called when the user clicks the remove account button.
   */
  const deleteAccount = () => {
    getCsrfToken().then((csrfToken) => {
      fetch(`${API_HOST}/msg/delete_account`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFTOKEN": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({
          user: localStorage.getItem("whoami"),
          password: password,
        }),
      })
        .then((res) => {
          if (res.status === 200) {
            props.setSelectedUser(null);
            localStorage.removeItem("whoami");
            navigate("/");
          }
        })
        .catch((err) => {});
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
      borderRightColor={"gray.200"}
      padding={"1em"}
      h="full"
    >
      <Button
        leftIcon={<LockIcon />}
        onClick={() => {
          signOut();
        }}
        margin="3px"
      >
        Logout
      </Button>
      <Button
        leftIcon={<DeleteIcon />}
        onClick={() => {
          onOpen();
        }}
        backgroundColor="red.300"
        _hover={{
          backgroundColor: "red.400",
        }}
      >
        Delete Account
      </Button>
      <Center paddingTop={"1em"} paddingBottom={"1em"}>
        <HStack>
          <Text fontSize="xl">{user}</Text>
          <Text fontSize="sm">#{securityCode}</Text>
        </HStack>
      </Center>
      <FriendsList setSelectedUser={props.setSelectedUser} />
      <PasswordModal
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        setPassword={setPassword}
        password={password}
        handleSubmit={() => deleteAccount()}
        modalBody="Your account will be deleted. Please enter your password to confirm."
      />
    </Box>
  );
}

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  Input,
  Stack,
  Button,
  Text,
  Link,
  Center,
} from "@chakra-ui/react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as openpgp from "openpgp";
import { GLOBALS } from "../core/GlobalVariables";
import { clearCsrfToken, API_HOST } from "../Utils";

export default function SimpleCard(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      username.match(/^[a-zA-Z0-9_]{3,20}$/) !== null &&
      password.length >= 8 &&
      password.length <= 20
    ) {
      openpgp
        .generateKey({
          type: "ecc", // Type of the key, defaults to ECC
          curve: "curve25519", // ECC curve name, defaults to curve25519
          userIDs: [{ name: username }],
          passphrase: password,
          format: "armored",
        })
        .then((key) => {
          console.debug(key);
          console.debug(username, password);

          // Store the web using WebStorage
          localStorage.setItem(
            GLOBALS.WEBSTORAGE_KEYPAIR_ENTRY_PREFIX + username,
            JSON.stringify(key)
          );
          console.debug("Stored keypair in localStorage");
          localStorage.setItem("whoami", username);
          GLOBALS.PGP_KEY_PASSWORD = password; // Store the password in a global variable so that the chat can decrypt the messages
          props.password.password = password;

          // Register with out new public key
          fetch(`${API_HOST}/msg/sign_up`, {
            method: "POST",
            body: JSON.stringify({
              user: username,
              password: password,
              public_pgp_key: key.publicKey,
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              alert("Account created. Please re-login.");
              // console.log(data);
              clearCsrfToken();
              // Go tho the chat page
              navigate("/");
            });
        });
    } else {
      alert("Invalid username or password");
    }
  };

  return (
    <Flex minH={"100vh"} align={"center"} justify={"center"}>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Center>
          <Text fontSize={"2xl"}>Register</Text>
        </Center>
        <Box rounded={"lg"} boxShadow={"lg"} p={8}>
          <Stack spacing={4}>
            <FormControl id="email">
              <FormLabel>Username</FormLabel>
              <Input
                type="username"
                focusBorderColor="gray.400"
                onChange={(e) => setUsername(e.currentTarget.value)}
              />
              <FormHelperText>
                Username only accepts alphanumeric characters, hyphens and
                underscores and must be between 3 and 20 characters long.
              </FormHelperText>
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                focusBorderColor="gray.400"
                onChange={(e) => setPassword(e.currentTarget.value)}
              />
              <FormHelperText>
                Password must be between 8 and 20 characters long.
              </FormHelperText>
            </FormControl>
            <Stack spacing={10}>
              <Button
                width={"5em"}
                alignSelf={"center"}
                type="submit"
                onClick={handleSubmit}
                _hover={{
                  bg: "gray.200",
                }}
              >
                Sign up
              </Button>
            </Stack>
            <Center>
              <Text>
                Already have an account ?{" "}
                <Link onClick={() => navigate("/")}>Login here</Link>.
              </Text>
            </Center>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}

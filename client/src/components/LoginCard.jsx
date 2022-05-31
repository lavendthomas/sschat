import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Text,
  Link,
  Center,
} from "@chakra-ui/react";
import getCsrfToken, { clearCsrfToken, API_HOST } from "../Utils";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { setGlobalPassword } from "../core/GlobalVariables";

/**
 * This component is responsible for rendering the login card.
 * @param {*} props
 * @returns The login card component
 */
export default function LoginCard(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  /**
   * This function is responsible for logging in the user.
   * It is called when the user clicks the login button.
   * @param {*} e
   */
  const handleSubmit = (e) => {
    getCsrfToken().then((csrfToken) => {
      e.preventDefault();
      setGlobalPassword(password); // Store the password in a global variable so that the chat can decrypt the messages
      props.password.password = password;
      localStorage.setItem("whoami", username);
      fetch(`${API_HOST}/msg/sign_in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          "X-CSRFToken": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({
          user: username,
          password: password,
        }),
      }).then((res) => {
        if (res.status === 200) {
          clearCsrfToken();
          navigate("/chat");
        } else {
          alert("Invalid username or password");
        }
      });
    }, []);
  };

  return (
    <Flex minH={"100vh"} align={"center"} justify={"center"}>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Center>
          <Text fontSize={"2xl"}>Login</Text>
        </Center>
        <Box rounded={"lg"} boxShadow={"lg"} p={8}>
          <Stack spacing={4}>
            <FormControl id="username">
              <FormLabel>Username</FormLabel>
              <Input
                type="username"
                focusBorderColor="gray.400"
                onChange={(e) => setUsername(e.currentTarget.value)}
              />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                focusBorderColor="gray.400"
                onChange={(e) => setPassword(e.currentTarget.value)}
              />
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
                Sign in
              </Button>
            </Stack>
            <Text>
              Don't have an account yet ?{" "}
              <Link onClick={() => navigate("/signup")}>Register here</Link>.
            </Text>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}

import {
  Button,
  Center,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
} from "@chakra-ui/react";

import { DeleteIcon } from "@chakra-ui/icons";

import { useEffect, useState } from "react";
import { PublicKeyStorage } from "../core/PublicKeyStorage";
import getCsrfToken, { API_HOST } from "../Utils";

const FriendsList = (props) => {
  const [friendsList, setFriendsList] = useState([]);
  const [refreshFriendsList, setRefreshFriendsList] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getCsrfToken().then((csrfToken) => {
      fetch(`${API_HOST}/msg/friends_list_detailed`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          "X-CSRFToken": csrfToken,
        },
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          // Check that all PGP keys match
          data.friends.forEach((friend) => {
            PublicKeyStorage.update(friend.name, friend.public_pgp_key);
          });

          setFriendsList(data.friends);
        });
    });
  }, [refreshFriendsList]);

  const handleFriendClick = (friend) => {
    props.setSelectedUser(friend);
  };

  const handleFriendDelete = (friend) => {
    getCsrfToken().then((csrfToken) => {
      fetch(`${API_HOST}/msg/reject_friend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({
          friend: friend,
        }),
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          setRefreshFriendsList(!refreshFriendsList);
        });
    });
  };

  const handleFriendClickGenerator = (friend) => () =>
    handleFriendClick(friend);

  const handleFriendDeleteGenerator = (friend) => () =>
    handleFriendDelete(friend);

  const RenderFriends = () => {
    return friendsList
      .map((details) => details.name)
      .map((friend) => (
        <HStack key={friend}>
          <Text cursor={"pointer"} onClick={handleFriendClickGenerator(friend)}>
            {friend}
          </Text>
          <DeleteIcon
            cursor={"pointer"}
            onClick={handleFriendDeleteGenerator(friend)}
          />
        </HStack>
      ));
  };

  const addFriend = (e) => {
    e.preventDefault();
    getCsrfToken().then((csrfToken) => {
      fetch(`${API_HOST}/msg/ask_friend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          "X-CSRFToken": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({
          friend: search,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.debug(data);
          setRefreshFriendsList(!refreshFriendsList);
        });
    });
  };

  return (
    <div className="friends-list">
      <Text fontSize="2xl" fontWeight="bold" paddingBottom={".25em"}>
        Friend List
      </Text>

      <Center>
        <VStack align={"left"}>
          <RenderFriends />
        </VStack>
      </Center>
      <InputGroup paddingTop={"1em"}>
        <Input
          placeholder="Add a friend"
          name="friend"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <InputRightElement width="4.5em" paddingTop={"2em"}>
          <Button h="1.75rem" size="sm" onClick={addFriend}>
            Add
          </Button>
        </InputRightElement>
      </InputGroup>
    </div>
  );
};

export default FriendsList;

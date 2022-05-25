import {
  Button,
  Center,
  Input,
  InputGroup,
  InputRightElement,
  Text
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { PublicKeyStorage } from "../core/PublicKeyStorage";
import getCsrfToken from "../Utils";

const FriendsList = (props) => {
  const [friendsList, setFriendsList] = useState([]);
  const [refreshFriendsList, setRefreshFriendsList] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getCsrfToken().then((csrfToken) => {
      fetch("http://localhost:8000/msg/friends_list_detailed", {
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
          console.log(data);

          // Check that all PGP keys match
          data.forEach(friend => {
            PublicKeyStorage.update(friend.username, friend.public_pgp_key);
          });

          setFriendsList(data);
        });
    });
  }, [refreshFriendsList]);

  const handleFriendClick = (friend) => {
    console.log("selected friend: ", friend);
    props.setSelectedUser(friend);
  };

  const handleFriendClickGenerator = (friend) => () =>
    handleFriendClick(friend);

  const RenderFriends = () => {
    return friendsList.map((details => details.name)).map((friend) => (
      <li onClick={handleFriendClickGenerator(friend)}>{friend}</li>
    ));
  };

  const addFriend = (e) => {
    e.preventDefault();
    getCsrfToken().then((csrfToken) => {
      fetch("http://localhost:8000/msg/ask_friend", {
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
      <Center>
        <Text fontSize="2xl" fontWeight="bold" paddingBottom={"1em"}>
          Friend List
        </Text>
      </Center>
      <InputGroup>
        <Input
          placeholder="Add a friend"
          name="friend"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <InputRightElement width="4.5em">
          <Button h="1.75rem" size="sm" onClick={addFriend}>
            Add
          </Button>
        </InputRightElement>
      </InputGroup>
      <Center>
        <ul>
          <RenderFriends />
        </ul>
      </Center>
    </div>
  );
};

export default FriendsList;

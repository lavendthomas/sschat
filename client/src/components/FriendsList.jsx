import { useEffect, useState } from "react";
import getCsrfToken from "../Utils";

const FriendsList = (props) => {

    const [friendsList, setFriendsList] = useState([]);

    useEffect(() => {
        getCsrfToken().then(csrfToken => {
            fetch("http://localhost:8000/msg/friends_list", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "*/*",
                    "X-CSRFToken": csrfToken,
                    },
                credentials: "include",
                })
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    setFriendsList(data);
                });
            })
        }, []);

    const RenderFriends = () => {
        return friendsList.map(friend => <li>{friend}</li>)
    }

    return (
        <div className="friends-list">
            <ul>
                <RenderFriends />
            </ul>
        </div>
    );
};

export default FriendsList;
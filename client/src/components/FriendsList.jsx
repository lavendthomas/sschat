const Input = (props) => {

    const [friendsList, setFriendsList] = useState([]);

    const fetchFriends = async () => {
        fetch("http://localhost:8000/msg/sign_in", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "*/*",
                "X-CSRFToken": await getCsrfToken(),
                },
            credentials: "include",
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setFriendsList(data);
            }
        );
    }


    const RenderFriends = () => {
        friends_list_items = []
        for (const friend in friendsList) {
            <li>friend</li>
        }
        return friends_list_items
    }

    return (
        <div className="friends-list">
            <ol>
                <RenderFriends />
            </ol>
        </div>
    );
};

export default Input;
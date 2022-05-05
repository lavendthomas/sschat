import React, { useRef } from "react";
import Input from "./components/Input";
import FriendsList from "./components/FriendsList";
import getCsrfToken from "./Utils";
import "./Login.css";

const Login = () => {
    const usernameRef = useRef();
    const passwordRef = useRef();

    const loggedIn = useRef(false);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        fetch("http://localhost:8000/msg/sign_in", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "*/*",
                "X-CSRFToken": await getCsrfToken(),
                },
            credentials: "include",
            body: JSON.stringify({
                user: usernameRef.current.value,
                password: passwordRef.current.value,
                }),
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                loggedIn.current = true;
            }
        );
    };
    
    return (
        <div>
            <div className="login">
            <form onSubmit={handleSubmit}>
                <Input label="Username" type="text" refer={usernameRef} />
                <Input label="Password" type="password" refer={passwordRef} />
                <button>Login</button>
            </form>
            </div>
            <FriendsList/>
        </div>
    );
};


export default Login;
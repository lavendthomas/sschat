import React from "react";
import LoginCard from "./components/LoginCard";
import FriendsList from "./components/FriendsList";
import "./Login.css";

const Login = () => {
    return (
        <div>
            <LoginCard />
            <FriendsList/>
        </div>
    );
};


export default Login;
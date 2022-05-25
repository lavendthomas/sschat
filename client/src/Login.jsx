import React from "react";
import LoginCard from "./components/LoginCard";
import FriendsList from "./components/FriendsList";

const Login = (props) => {
    return (
        <div>
            <LoginCard password={props.password}/>
            {/* <FriendsList /> */}
        </div>
    );
};


export default Login;
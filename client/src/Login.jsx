import React from "react";
import LoginCard from "./components/LoginCard";

const Login = (props) => {
    return (
        <div>
            <LoginCard password={props.password}/>
        </div>
    );
};


export default Login;
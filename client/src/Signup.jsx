import React from "react";
import SignupCard from "./components/SignupCard";

const Signup = (props) => {
    return (
        <div>
            <SignupCard password={props.password}/>
        </div>
    );
};


export default Signup;
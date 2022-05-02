import React, { useRef } from "react";
import Input from "./components/Input";
import "./Login.css";

const Login = () => {
    // const [username, setUsername] = useState("");
    // const [password, setPassword] = useState("");

    const usernameRef = useRef();
    const passwordRef = useRef();
    
    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("http://localhost:8000/msg/sign_in", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "*/*"
                },
                body: JSON.stringify({
                    user: usernameRef.current.value,
                    password: passwordRef.current.value,
                    }),
                })
            .then(res => res.json())
            .then(data => {
                console.log(data);
            }
        );
    };
    
    return (
        <div className="login">
        <form onSubmit={handleSubmit}>
            <Input label="Username" type="text" refer={usernameRef} />
            <Input label="Password" type="password" refer={passwordRef} />
            <button>Login</button>
        </form>
        </div>
    );
};


export default Login;
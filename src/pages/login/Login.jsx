import { useRef, useContext } from "react";
import "./login.css";
import loginCall from "../../apiCalls"
import { AuthContext } from '../../context/AuthContext'
import { CircularProgress } from "@mui/material";

export default function Login() {
    const email = useRef();
    const password = useRef();

    const { user, isFetching, dispatch } = useContext(AuthContext)

    const handleClick = (e) => {
        e.preventDefault();
        console.log(email.current.value);
        loginCall({ email: email.current.value, password: password.current.value }, dispatch)
    }
    console.log(user);

    return (
        <div className="login">
            <div className="loginWrapper">
                <div className="loginLeft">
                    <h3 className="loginLogo">Personal-Social</h3>
                    <span className="loginDesc">
                        Connect with friends and the world around you on Lamasocial.
                    </span>
                </div>
                <div className="loginRight">
                    <form className="loginBox" onSubmit={handleClick}>
                        <input
                            placeholder="Email"
                            type="email"
                            className="loginInput"
                            required
                            ref={email} />

                        <input placeholder="Password"
                            type="password"
                            minLength="6"
                            className="loginInput"
                            required
                            ref={password} />
                        <button className="loginButton" disabled={isFetching}>{isFetching ? <CircularProgress size={"24px"} color="white" /> : "Log In"}</button>
                        <span className="loginForgot">Forgot Password?</span>
                        <button className="loginRegisterButton">
                            {isFetching ? <CircularProgress size={"24px"} color="white" /> : "Create a New Account"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
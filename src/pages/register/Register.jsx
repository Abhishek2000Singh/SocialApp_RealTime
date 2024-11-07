import { useRef } from "react";
import "./register.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const username = useRef()
    const email = useRef();
    const password = useRef();
    const confirmPassword = useRef();
    const navigate = useNavigate()

    const handleClick = async(e) => {
        e.preventDefault();
        if (password.current.value !== confirmPassword.current.value) {
            confirmPassword.current.setCustomValidity("password don't matched!")
        } else {
            const user = {
                username: username.current.value,
                email: email.current.value,
                password: password.current.value,
            }
            try {
                await axios.post('/auth/register', user)
                navigate("/login")

            } catch (error) {
                console.log(error)
            }

        }

    }


    return (
        <div className="login">
            <div className="loginWrapper">
                <div className="loginLeft">
                    <h3 className="loginLogo">Personal-Social</h3>
                    <span className="loginDesc">
                        Connect with friends and the world around you on Lamasocial.
                    </span>
                </div>
                <form className="loginRight" onSubmit={handleClick}>
                    <div className="loginBox">
                        <input
                            placeholder="Username"
                            required
                            ref={username}
                            className="loginInput"
                        />
                        <input
                            placeholder="Email"
                            required
                            ref={email}
                            className="loginInput"
                            type="email"
                        />
                        <input
                            placeholder="Password"
                            required
                            ref={password}
                            className="loginInput"
                            type="password"
                            minLength={6}
                        />
                        <input
                            placeholder="Confirm Password"
                            required
                            ref={confirmPassword}
                            className="loginInput"
                            type="password"
                        />


                        <button className="loginButton" type="submit">Sign Up</button>
                        <button className="loginRegisterButton">
                            Log into your Account
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
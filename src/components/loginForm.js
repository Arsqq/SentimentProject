import React, {useEffect, useState} from "react";
import "./style.css"

const LoginForm = () => {
    const onSuccess = e => {
        alert("User signed in")
        console.log(e)
    }

    const onFailure = e => {
        alert("User sign in Failed")
        console.log(e)
    }

    return (
        <div className="box">
            <form autoComplete="off">
                <h2>Sign in</h2>
                <div className="inputBox">
                    <input type="text" required="required"/>
                        <span>Userame</span>
                        <i/>
                </div>
                <div className="inputBox">
                    <input type="password" required="required"/>
                        <span>Password</span>
                        <i/>
                </div>
                <div className="links">
                    <a href="#">Forgot Password ?</a>
                    <a href="#">Signup</a>
                </div>
                <input type="submit" value="Login"/>
            </form>
        </div>
    )
}
export default LoginForm

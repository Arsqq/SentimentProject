import React, { Component } from "react";
import { Routes, Route, Link } from "react-router-dom";
import AuthService from "./components/Service/auth.service";
import Login from "./components/ReactComponents/login.component";
import Register from "./components/ReactComponents/register.component";
import Home from "./components/ReactComponents/home.component";
import Profile from "./components/ReactComponents/profile.component";
import EventBus from "./common/EventBus";
import UserTable from "./components/ReactComponents/userTable.component"
import TwitterComponent from "./components/ReactComponents/tweets.component";
import {NotFoundPageComponent} from "./components/ReactComponents/notFoundPage.component"

class App extends Component {
    constructor(props) {
        super(props);
        this.logOut = this.logOut.bind(this);

        this.state = {
            currentUser: undefined,
        };
    }

    componentDidMount() {
        const user = AuthService.getCurrentUser();

        if (user) {
            this.setState({
                currentUser: user,
            });
        }

        EventBus.on("logout", () => {
            this.logOut();
        });
    }

    componentWillUnmount() {
        EventBus.remove("logout");
    }

    logOut() {
        AuthService.logout();
        this.setState({
            currentUser: undefined,
        });
    }

    render() {
        const { currentUser, showModeratorBoard, showAdminBoard } = this.state;

        return (
                <div>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/userTable" element={<UserTable />} />
                        <Route path="/customTweets" element={<TwitterComponent />} />
                        <Route path="*" element={<NotFoundPageComponent />} />
                    </Routes>
                </div>
        );
    }
}

export default App;

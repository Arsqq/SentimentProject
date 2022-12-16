import React from "react";
import AuthService from "../Service/auth.service";
import "../staticFilesCss/aside.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "@fortawesome/free-solid-svg-icons"

export function NavBarComponent(){
    const currentUser = AuthService.getCurrentUser();
    let showTable=false
    console.log(currentUser)
    if (currentUser.roles.includes("ROLE_ADMIN")){
        showTable=true
    }


    return(
        <nav className="navbar navbar-dark align-items-start sidebar sidebar-dark accordion bg-gradient-dark p-0">
        <div className="container-fluid d-flex flex-column p-0">
            <a className="navbar-brand d-flex justify-content-center align-items-center sidebar-brand m-0" href="#">
            <div className="sidebar-brand-icon rotate-n-15"><i className="fas fa-brain"/></div>
            <div className="sidebar-brand-text mx-3">
                <span>SENTIT</span>
            </div>
        </a>
            <ul className="navbar-nav text-light" id="accordionSidebar" style={{fontFamily: 'Chocolate cyr-lat'}}>
                <li className="nav-item"><a className="nav-link active" href="/profile"><i
                    className="fas fa-tachometer-alt"/>
                    <span>Dashboard</span></a>
                </li>
                {showTable &&
                    <li className="nav-item"><a className="nav-link" href="/userTable"><i
                        className="fas fa-table"/><span>Table</span>
                    </a>
                    </li>
                }
                    <li className={"nav-item"}>
                        <a className="nav-link" href="/customTweets"><i className="far fa-user-circle"/><span>Custom Sentiment Analysis</span></a>
                    </li>


            </ul>
        </div>
    </nav>);
}
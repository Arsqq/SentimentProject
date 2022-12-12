import React from "react";

export function NavBarComponent(){
    return <nav className="navbar navbar-dark align-items-start sidebar sidebar-dark accordion bg-gradient-primary p-0">
        <div className="container-fluid d-flex flex-column p-0">
            <a className="navbar-brand d-flex justify-content-center align-items-center sidebar-brand m-0" href="#">
            <div className="sidebar-brand-icon rotate-n-15"><i className="fas fa-laugh-wink"/></div>
            <div className="sidebar-brand-text mx-3">
                <span>SENTIT</span>
            </div>
        </a>
            <ul className="navbar-nav text-light" id="accordionSidebar">
                <li className="nav-item"><a className="nav-link active" href="/profile"><i
                    className="fas fa-tachometer-alt"/><span>Dashboard</span></a></li>
                <li className="nav-item"><a className="nav-link" href="/userTable"><i className="fas fa-table"/><span>Table</span></a>
                    <a className="nav-link"><i className="far fa-user-circle"/><span>Custom Sentiment Analysis</span></a>
                </li>
                <li className="nav-item"/>
                <li className="nav-item"/>
                <li className="nav-item"/>
            </ul>
            <div className="text-center d-none d-md-inline">
                <button className="btn rounded-circle border-0" id="sidebarToggle" type="button"/>
            </div>
        </div>
    </nav>;
}
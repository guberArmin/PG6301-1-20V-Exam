import React from "react";

import {Link, withRouter} from "react-router-dom";

export class Navigation extends React.Component {
    constructor(props) {
        super(props);
    }

    logOut = async () => {
        const url = "/api/logout";

        let response;

        try {
            response = await fetch(url, {method: "post"});
        } catch (error) {
            alert("Failed to connect to server: " + error);
            return;
        }

        if (response.status !== 204) {
            alert("Error when connecting to server: status code " + response.status);
            return;
        }

        this.props.updateLoggedInUser(null);
        this.props.history.push("/");

    };

    renderLoggedIn = (userId) => {
        return (
            <div>
                <label>
                    Welcome {userId} !!!
                    <button id={"logoutBtn"} className={"btn btn-light m-3"} onClick={this.logOut}>Logout</button>

                </label>
            </div>
        );

    };

    renderNotLoggedIn = () => {
        return (
            <div>
                <div>
                    <label>You are not logged in!
                        <Link id={"loginBtn"} to={"/login"} role="button" className={"btn btn-light m-3"}>Login</Link>
                        <Link id={"signUpBtn"} to={"/signUp"} role="button" className={"btn btn-danger m-3"}>Sign up</Link>
                    </label>
                </div>
            </div>
        );
    };

    render() {
        const userId = this.props.userId;
        let content;
        if (userId) {
            content = this.renderLoggedIn(userId);
        } else {
            content = this.renderNotLoggedIn();
        }
        return (
            <div className={"header"}>

                <nav className={"navbar navbar-expand-sm py-1  bg-dark navbar-dark fixed-top"}>
                    <div className={"navbar-nav mr-auto"}>
                        <Link className={"navbar-brand"} to={"/"}>
                            <img className={"logo-image"}
                                 src={"logo.png"}
                                 alt={"Go to home"} title={"Go to home"}/>
                        </Link>
                        <ul className={"navbar-nav"}>
                            <li className={"nav-item "}>
                                <a className="nav-link" href="/description">View all collectibles </a>
                            </li>
                        </ul>
                    </div>
                    <div className={"navbar-nav ml-auto text-light"}>
                        {content}
                    </div>
                </nav>

            </div>
        );
    }
}

export default withRouter(Navigation);
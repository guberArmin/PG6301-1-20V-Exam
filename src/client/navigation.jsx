import React from "react";
import {Link, withRouter} from "react-router-dom";

export class Navigation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null
        }
    }

    logOut = async () => {
        const url = "/api/logout";
        let response;
        try {
            response = await fetch(url, {method: "post"});
        } catch (error) {
            this.setState({error: "Failed to connect to server: " + error});
            return;
        }
        if (response.status !== 204) {
            this.setState({error: "Error when connecting to server: status code " + response.status});
            return;
        }
        this.props.updateLoggedInUser(null);
        this.props.history.push("/");
        //Force rerender, remove errors if any
        this.setState({error:null})
    };


    renderLoggedIn = (userId) => {
        return (
            <div>
                <label>
                    Welcome {userId} !!!
                    <button id={"logoutBtn"} className={"btn btn-light m-3"} onClick={this.logOut}>Logout</button>
                    <label className={"userInfo"}>Geons: {this.props.user.geons}</label>
                    <label className={"userInfo"}>Loot boxes: {this.props.user.lootBoxes}</label>
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
                        <Link id={"signUpBtn"} to={"/signUp"} role="button" className={"btn btn-danger m-3"}>Sign
                            up</Link>
                    </label>
                </div>
            </div>
        );
    };

    render() {
        if (this.state.error) {
            return <h1 className="{alert alert-error}">{this.state.error}</h1>
        }
        const userId = this.props.user ? this.props.user.id : null;
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
                                <Link id={"desBtn"} to={"/description"} role="button" className={"nav-link"}>View all
                                    collectibles </Link>
                            </li>
                        </ul>
                        {userId && <ul className={"navbar-nav"}>
                            <li className={"nav-item "}>
                                <Link id={"signUpBtn"} to={"/loot"} role="button" className={"nav-link"}>Open loot
                                    boxes </Link>
                            </li>
                        </ul>}
                        {userId && <ul className={"navbar-nav"}>
                            <li className={"nav-item "}>
                                <Link id={"statsBtn"} to={"/stats"} role="button" className={"nav-link"}>Stats and
                                    sale</Link>
                            </li>
                        </ul>}
                        {userId && <ul className={"navbar-nav"}>
                            <li className={"nav-item "}>
                                <Link id={"shopBtn"} to={"/shop"} role="button" className={"nav-link"}>Shop</Link>

                            </li>
                        </ul>}
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
import React from "react"
import {withRouter} from "react-router-dom";

/**
 * This file is copy/adaptation of https://github.com/arcuri82/web_development_and_api_design/blob/master/exercise-solutions/quiz-game/part-10/src/client/login.jsx
 */

export class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userId: "",
            password: "",
            error: "",
            message: null
        };
    }

    onUserIdChang = event => {
        this.setState({userId: event.target.value})
    };

    onPasswordChange = event => {
        this.setState({password: event.target.value});
    };


    tryToLogin = async () => {
        const {userId, password} = this.state;

        const url = "/api/login";

        const payload = {userId: userId, password: password};

        let response;

        try {
            response = await fetch(url, {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });
        } catch (err) {
            this.setState({error: "Failed to connect to server:" + err});
            return;
        }

        if (response.status === 401) {
            this.setState({error: "Wrong id or password"});
            return;
        }

        if (response.status !== 204) {
            this.setState({error: "Error when connecting to server status code" + response.status});
            return;
        }

        this.setState({error: null});
        await this.props.fetchAndUpdateUserInfo();
        this.setState({message: "Login successful"});
        this.props.history.push("/");
    };

    render() {
        let error = <div></div>;
        if (this.state.error) {
            error =
                <div>
                    <p>{this.state.error}</p>
                </div>
        }
        return (
            <div className={"registrationForm"}>
                {this.state.message && <p>{this.state.message}</p>}
                <label>User id
                    <input
                        id={"idInput"}
                        type="text"
                        onChange={this.onUserIdChang}
                        value={this.state.userId}
                    /></label>
                <label>Password:
                    <input
                        id={"passwordInput"}
                        type="password"
                        onChange={this.onPasswordChange}
                        value={this.state.password}
                    /></label>
                {error}

                <button id={"loginBtn"} className={"btn btn-outline-dark m-3"} onClick={this.tryToLogin}>Log in</button>
            </div>
        );
    }

}

export default withRouter(Login);
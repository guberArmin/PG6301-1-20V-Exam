import React from 'react';
import {withRouter} from 'react-router-dom'

/**
 * This class is adaptation/copy of:
 * https://github.com/arcuri82/web_development_and_api_design/blob/master/exercise-solutions/quiz-game/part-10/src/client/signup.jsx
 */
export class SignUp extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            userId: "",
            password: "",
            confirm: "",
            errorMsg: null
        };
    }

    onUserIdChange = (event) => {
        this.setState({userId: event.target.value, errorMsg: null});
    };

    onPasswordChange = (event) => {
        this.setState({password: event.target.value, errorMsg: null});
    };

    onConfirmChange = (event) => {
        this.setState({confirm: event.target.value, errorMsg: null});
    };

    doSignUp = async () => {

        const {userId, password, confirm} = this.state;

        if (confirm !== password) {
            this.setState({errorMsg: "Passwords do not match"});
            return;
        }

        const url = "/api/signup";

        const payload = {userId: userId, password: password};

        let response;

        try {
            response = await fetch(url, {
                method: "post",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
        } catch (err) {
            this.setState({errorMsg: "Failed to connect to server: " + err});
            return;
        }


        if (response.status === 400) {
            this.setState({errorMsg: "Invalid userId/password"});
            return;
        }

        if (response.status !== 201) {
            this.setState({errorMsg: "Error when connecting to server: status code " + response.status});
            return;
        }

        this.setState({errorMsg: null});
        await this.props.fetchAndUpdateUserInfo();
        this.props.history.push('/');
    };

    render() {

        let error = <div></div>;
        if (this.state.errorMsg) {
            error = <div className="errorMsg"><p>{this.state.errorMsg}</p></div>
        }

        let confirmMsg = "Ok";
        if (this.state.confirm !== this.state.password) {
            confirmMsg = "Not matching";
        }

        return (
            <div>
                <div className={"registrationForm"}>
                    <label>User Id:
                    <input type="text"
                           value={this.state.userId}
                           onChange={this.onUserIdChange}
                           id="userIdInput"
                           placeholder={"Enter user id"}
                    /></label>
                    <label>Password:
                    <input type="password"
                           value={this.state.password}
                           onChange={this.onPasswordChange}
                           id="passwordInput"
                           placeholder={"Enter password"}
                    /></label>
                    <label>Confirm password:
                    <input type="password"
                           value={this.state.confirm}
                           onChange={this.onConfirmChange}
                           id="confirmInput"
                           placeholder={"Confirm password"}
                    /></label>
                    <div>{confirmMsg}</div>
                    {error}

                    <div className="btn btn-success" onClick={this.doSignUp} id="signUpBtn">Sign Up</div>
                </div>


            </div>
        );
    }
}

export default withRouter(SignUp);

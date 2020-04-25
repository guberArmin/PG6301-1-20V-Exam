/**
 * This class is adaptation of:
 * https://github.com/arcuri82/web_development_and_api_design/blob/master/exercise-solutions/quiz-game/part-10/src/client/index.jsx
 */
import ReactDOM from "react-dom"
import {BrowserRouter, Switch, Route} from "react-router-dom"
import React from "react"

import {Navigation} from "./navigation";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null
        }
    }

    componentDidMount() {
        this.fetchAndUpdateUserInfo();
    }

    fetchAndUpdateUserInfo = async () => {
        const url = "/api/user";

        let response;

        try {
            response = await fetch(url, {
                method: "get"
            })
        } catch (error) {
            this.setState({error: "Failed to connect to server: " + error});
            return;
        }
        if (response.status === 401) {
            this.updateLoggedInUser(null);
            return;
        }

        if (response.status !== 200) {

        } else {
            const payload = await response.json();
            this.updateLoggedInUser(payload);
        }
    };

    updateLoggedInUser = (user) => {
        this.setState({user: user});
    };

    notFound() {
        return (
            <div>
                <h2>Page not found</h2>
                <p className={"alert alert-warning"}>
                    Page not found, double check you url!
                </p>
            </div>
        );
    };

    render() {
        const id = this.state.user ? this.state.user.id : null;
        return (
            <BrowserRouter>
                <Navigation
                    userId={id}
                    updateLoggedInUser={this.updateLoggedInUser}
                />
                <div>
                    <Switch>
                        <Route component={this.notFound}/>
                    </Switch>
                </div>
            </BrowserRouter>
        )
    }
}

ReactDOM.render(<App/>, document.getElementById("root"));
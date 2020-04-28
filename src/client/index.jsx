/**
 * This class is adaptation of:
 * https://github.com/arcuri82/web_development_and_api_design/blob/master/exercise-solutions/quiz-game/part-10/src/client/index.jsx
 */
import ReactDOM from "react-dom"
import {BrowserRouter, Switch, Route} from "react-router-dom"
import React from "react"

import Navigation from "./navigation";
import {GameDescription} from "./game-description";
import Home from "./home";
import Login from "./login";
import SignUp from "./signup";
import LootBoxes from "./loot-boxes";
import Stats from "./stats";
import Shop from "./shop";

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
                <p className={"alert alert-warning"}>
                    Page not found, double check you url!
                </p>
            </div>
        );
    };

    render() {
        return (
            <BrowserRouter>
                <Navigation
                    user={this.state.user}
                    fetchAndUpdateUserInfo={this.fetchAndUpdateUserInfo}
                    updateLoggedInUser={this.updateLoggedInUser}
                />
                <div>
                    <Switch>

                        <Route exact path="/" render={props =>
                            <Home {...props}
                                  user={this.state.user}
                                  updateLoggedInUser={this.updateLoggedInUser}
                                  fetchAndUpdateUserInfo={this.fetchAndUpdateUserInfo}
                            />
                        }/>
                        <Route exact path="/loot" render={props =>
                            <LootBoxes {...props}
                                       fetchAndUpdateUserInfo={this.fetchAndUpdateUserInfo}
                                       updateLoggedInUser={this.updateLoggedInUser}
                                       user={this.state.user}
                            />
                        }/>
                        <Route exact path={"/login"} render={props =>
                            <Login {...props}
                                   fetchAndUpdateUserInfo={this.fetchAndUpdateUserInfo}
                            />
                        }/>
                        <Route exact path={"/shop"} render={props =>
                            <Shop {...props}
                                  user={this.state.user}

                                  fetchAndUpdateUserInfo={this.fetchAndUpdateUserInfo}
                            />
                        }/>
                        <Route exact path={"/stats"} render={props =>
                            <Stats {...props}
                                   user={this.state.user}
                                   fetchAndUpdateUserInfo={this.fetchAndUpdateUserInfo}
                            />
                        }/>
                        <Route exact path={"/signup"} render={props =>
                            <SignUp {...props}
                                    fetchAndUpdateUserInfo={this.fetchAndUpdateUserInfo}
                            />
                        }/>
                        <Route exact path={"/description"} render={props =>
                            <GameDescription {...props}/>
                        }/>
                        <Route component={this.notFound}/>
                    </Switch>
                </div>
            </BrowserRouter>
        )
    }
}

ReactDOM.render(<App/>, document.getElementById("root"));
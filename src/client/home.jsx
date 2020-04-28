import React from "react"
import {Link, withRouter} from 'react-router-dom'
import {checkForDuplicates} from "./utils"

export class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            players: null,
            lootBoxes: this.props.user ? this.props.user.lootBoxes : null
        }
    }

    componentDidMount() {
        if (this.props.user) {
            this.props.fetchAndUpdateUserInfo();
        }
        this.getUsersCollection();
    }


    getUsersCollection = async () => {
        const url = "/api/user/players";
        let response;
        let payload;

        try {
            response = await fetch(url, {method: "get"});
        } catch (e) {
            this.setState({error: "Failed to connect to server:" + e});
            return;
        }
        //If we get 401 we are not logged in
        //Refresh this page and update info about logged in user
        if (response.status === 401) {
            this.props.updateLoggedInUser(null);
            this.props.history.push("/");
            return;
        }

        if (response.status !== 200) {
            this.setState({error: "Failed getting data: " + response.status});
            return;
        }
        payload = await response.json();
        //If we are here we have gotten response, lets set it
        this.setState({
            players: payload.players,
        })
    };

    render() {
        if (this.state.error) {
            return <p className={"alert alert-danger"}>Error : {this.state.error}</p>;
        }

        if (!this.props.user) {
            return (
                <div>
                    <p className={"alert alert-warning"}>To see your collection you have to
                        <Link role="button" to={"/login"}> login </Link> or you can <Link
                            role="button" to={"/description"}> view all collectibles </Link></p>
                    <img src={"/logo.png"}/>
                </div>
            )
        }

        if (!this.state.players) {
            return <p className={"alert alert-warning"}>Loading...</p>
        }
        if (this.state.players.length === 0) {
            return <p className={"alert alert-warning"}>You do not own any players.</p>
        }

        //Count number of duplicates and set displayed to false
        let duplicates = checkForDuplicates(this.state.players);
        let counter = 0;
        return (
            <div>
                <div className={"lootBoxes"}>
                    You have: <b>{this.props.user.lootBoxes} loot boxes </b>
                    <a href={"/loot"}>Click here to open them</a>
                </div>
                <div className={"userCollection"}>
                    <h3>You own following players: </h3>
                    {this.state.players.map((player, index) => {
                        //If we did not display it show it else just skip it
                        if (!duplicates[player.id].displayed) {
                            counter++;
                            duplicates[player.id].displayed = true;
                            return (<div key={index + "player-card"} className={"alert alert-info"}>
                                <p>{counter}.</p>
                                <p>Name: {player.name}</p>
                                <p>Last name: {player.lastName}</p>
                                <p>Nationality: {player.nationality}</p>
                                <p>Team: {player.team}</p>
                                <p>Age: {player.age}</p>
                                <p>Number of copies owned: {duplicates[player.id].numberOfCopies}</p>
                                <br/>
                            </div>);
                        }
                    })}
                </div>
            </div>
        );
    };
}

export default withRouter(Home);
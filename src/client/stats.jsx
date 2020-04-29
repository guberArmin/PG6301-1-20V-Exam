import React from "react"
import {Link, withRouter} from 'react-router-dom'
import {checkForDuplicates} from "./utils"

export class Stats extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            owned: null,
            missing: null,
            duplicates: null,
            showMissing: false,
            buttonText: "Show missing cards"
        }
    }

    componentDidMount() {
        this.getOwnedPlayers();
        this.getMissingPlayers();

    }

    getOwnedPlayers = async () => {
        const url = "/api/user/players";
        let response;
        let payload;

        try {
            response = await fetch(url, {method: "get"});
        } catch (e) {
            this.setState({error: "Failed to connect to server:" + e});
            return;
        }

        if (response.status !== 200) {
            this.setState({error: "Failed getting data: " + response.status});
            return;
        }
        payload = await response.json();

        //If we are here we have gotten response, lets set it
        this.setState({
            owned: payload.players,
        })
    };

    getMissingPlayers = async () => {
        const url = "/api/user/players?filter=missing";
        let response;
        let payload;

        try {
            response = await fetch(url, {method: "get"});
        } catch (e) {
            this.setState({error: "Failed to connect to server:" + e});
            return;
        }

        if (response.status !== 200) {
            this.setState({error: "Failed getting data: " + response.status});
            return;
        }

        payload = await response.json();

        this.setState({
            missing: payload.missing,
        })
    };

    buttonController = () => {
        if (!this.state.showMissing) {
            this.setState({buttonText: "Show duplicates"});
            this.setState({showMissing: true})

        } else {
            this.setState({buttonText: "Show missing cards"});
            this.setState({showMissing: false})
        }

    };

    sellDuplicate = async (id) => {
        if (!confirm("Are you sure that you want to sell this card? "))
            return;

        const url = "/api/user/players/" + id;
        let response;

        try {
            response = await fetch(url, {method: "delete"});
        } catch (e) {
            this.setState({error: "Failed to connect to server:" + e});
            return;
        }

        if (response.status === 401) {
            //I have custom error for such situations so no handling it here
            return;
        }

        if (response.status !== 204) {
            this.setState({error: "Failed getting data: " + response.status});
            return;
        }
        //As we should have gotten some geons on our account we need to update user info
        this.props.fetchAndUpdateUserInfo();
        //Update list of duplicates, no need to update missing ones as we cant sell if we have only one copy
        this.getOwnedPlayers();
    };


    render() {
        if (this.state.error) {
            return <p className={"alert alert-danger"}>Error : {this.state.error}</p>;
        }

        if (!this.state.missing && !this.state.owned) {
            return <p className={"alert alert-warning"}>Loading</p>

        }

        if (!this.props.user) {
            return (
                <div>
                    <p className={"alert alert-warning"}>To see your collection you have to
                        <Link role="button" to={"/login"}> login </Link> or you can <Link
                            role="button" to={"/description"}> view all collectibles </Link></p>
                </div>
            )
        }

        if (!this.state.owned) {
            return <p className={"alert alert-warning"}>You own no players, go and open some <a href={"/login"}>loot
                boxes</a></p>
        }


        if (this.state.showMissing) {
            return (
                <div>
                    <button id={"showDuplicatesBtn"} className={"btn btn-info"}
                            onClick={this.buttonController}>{this.state.buttonText}</button>
                    <h3 id={"missingHeader"}>You are missing: {this.state.missing.length} cards;
                    </h3>
                    {this.state.missing.map((player, index) => {
                        return (<div key={index + "player-card"} className={"alert player-card alert-info"}>
                            <p>Name: {player.name}</p>
                            <p>Last name: {player.lastName}</p>
                            <p>Nationality: {player.nationality}</p>
                            <p>Team: {player.team}</p>
                            <p>Age: {player.age}</p>
                            <br/>
                        </div>);
                    })}

                </div>

            )
        }

        let duplicates = checkForDuplicates(this.state.owned);
        let numberOfDuplicates = 0;
        Object.values(duplicates).forEach(p => {
            if (p.numberOfCopies > 1) numberOfDuplicates += p.numberOfCopies - 1
        });
        return (
            <div>
                <button id={"showMissingButton"} className={"btn btn-info"}
                        onClick={this.buttonController}>{this.state.buttonText}</button>
                <h3 id={"duplicatesHeader"}>You have: {numberOfDuplicates} duplicates</h3>
                {this.state.owned.map((player, index) => {
                    if (!duplicates[player.id].displayed && duplicates[player.id].numberOfCopies > 1) {
                        duplicates[player.id].displayed = true;
                        return (<div key={index + "player-card"} className={"alert alert-info player-card"}>
                            <p>Name: {player.name}</p>
                            <p>Last name: {player.lastName}</p>
                            <p>Nationality: {player.nationality}</p>
                            <p>Team: {player.team}</p>
                            <p>Age: {player.age}</p>
                            <p>Number of extra copies owned: {duplicates[player.id].numberOfCopies - 1}</p>
                            <button className={"btn btn-danger duplicate-button"} onClick={() => {
                                this.sellDuplicate(player.id)
                            }}>Sell one duplicate
                            </button>
                            <br/>
                        </div>);
                    }
                })}

            </div>
        );
    }

}

export default withRouter(Stats)
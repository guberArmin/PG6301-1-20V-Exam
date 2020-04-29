import React from "react"
import {Link, withRouter} from 'react-router-dom'

export class LootBoxes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            lootBoxesNr: null,
            lootedPlayers: null
        }
    }

    componentDidMount() {
        this.getNumberOfLootBoxes();

        //Needed for uploading on heroku as it uses https and local host is http
        let protocol = "ws:";
        if (window.location.protocol.toLowerCase() === "https:") {
            protocol = "wss:";
        }
        this.socket = new WebSocket(protocol + "//" + window.location.host);

        this.socket.onmessage = (event => {
            const message = JSON.parse(event.data);
            console.log(message);
            this.props.fetchAndUpdateUserInfo();
            this.getNumberOfLootBoxes();
        });

        this.socket.onopen = () => {
            this.doLogInWebSocket(this.props.userId);
        }
    }


    async doLogInWebSocket() {
        const url = "/api/wstoken";
        let response;
        try {
            response = await fetch(url, {
                method: "post"
            });
        } catch (err) {
            this.setState({errorMsg: "Failed to connect to server: " + err});
            return;
        }
        if (response.status === 401) {
            //this could happen if the session has expired
            this.setState({errorMsg: "You should log in first"});
            this.props.updateLoggedInUser(null);
            return;
        }

        if (response.status !== 201) {
            this.setState({errorMsg: "Error when connecting to server: status code " + response.status});
            return;
        }

        const payload = await response.json();
        payload.topic = 'login';

        this.socket.send(JSON.stringify(payload));
    };

    componentWillUnmount() {
        if (this.socket)
            this.socket.close();
    }

    getNumberOfLootBoxes = async () => {
        let url = "/api/user/loot";
        let response;
        let payload;
        try {
            response = await fetch(url, {method: "get"});
        } catch (e) {
            this.setState({error: "Failed to connect to server:" + e});
            return;
        }

        if (response.status === 401) {

            //I have custom error for such situations so no handling it here
            return;
        }

        //If we get 404 there are no more loot boxes on our account
        if (response.status === 404) {
            this.setState({error: "You have no more loot boxes"});
            return;
        }
        if (response.status !== 200) {
            this.setState({error: "Failed getting data: " + response.status});
            return;
        }
        payload = await response.json();

        this.setState({lootBoxesNr: payload.lootBoxesNr});

    };

    openLootBox = async () => {
        const url = "/api/user/loot";
        let response;
        let payload;
        if (!this.state.lootBoxesNr)
            return;
        try {
            //As server state changes we have to use POST and not GET
            response = await fetch(url, {method: "post"});
        } catch (e) {
            this.setState({error: "Failed to connect to server:" + e});
            return;
        }
        //Based on this discussion I went for : 404 https://stackoverflow.com/questions/11746894/what-is-the-proper-rest-response-code-for-a-valid-request-but-an-empty-data
        if (response.status === 404) {
            this.setState({error: "No more loot boxes"});
            return;
        }

        if (response.status !== 201) {
            this.setState({error: "Error when connecting to server status code" + response.status});
            return;
        }
        payload = await response.json();
        this.setState({lootedPlayers: payload.lootedPlayers});
        this.props.fetchAndUpdateUserInfo();
        //Number of loot boxes has changed, but we fetch value from server, just in case (e.g. user could have been logged inn from two browsers)
        this.getNumberOfLootBoxes();
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
                </div>
            )
        }
        if (this.state.lootBoxesNr === null || this.state.lootBoxesNr === undefined)
            return <p className={"alert alert-warning"}>Loading...</p>
        return (
            <div>
                <p id={"tipParagraph"}><b>Pro tip: staying on this page gets you free loot box every 30 seconds</b></p>
                <p>You have: <b><label id={"numberOfBoxesLabel"}>{this.state.lootBoxesNr}</label> loot boxes </b></p>
                {this.state.lootBoxesNr ?
                    <button id={"openBoxBtn"} onClick={this.openLootBox} className={"btn btn-danger"}>Open loot
                        box</button> : ""}
                {this.state.lootedPlayers &&
                <div>
                    {<div className={"playerContainer"}>
                        <h3>You got following players from loot box: </h3>
                        {this.state.lootedPlayers.map((player, index) => {
                            return (<div key={index + "player-card"} className={"alert alert-info player-card"}>
                                <div className={"playerInfo"}>
                                    <p>{index + 1}.</p>
                                    <p>Name: <b>{player.name}</b></p>
                                    <p>Last name:<b> {player.lastName}</b></p>
                                    <p>Nationality:<b> {player.nationality}</b></p>
                                    <p>Team: <b>{player.team}</b></p>
                                    <p>Age: <b>{player.age}</b></p>
                                </div>
                                <img className={"playerPicture"} src={player.picture ? player.picture : ""}/>
                                <br/>
                            </div>);
                        })}
                    </div>}
                </div>}
            </div>
        );
    }

}

export default withRouter(LootBoxes);
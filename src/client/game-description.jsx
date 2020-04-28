import React from "react"
import {Link, withRouter} from 'react-router-dom'

//No authentication or authorization needed for this component

export class GameDescription extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            players: null
        }
    }

    componentDidMount() {
        this.getAllPlayers();
    }

    getAllPlayers = async () => {
        const url = "/api/players";
        let response;
        let payload;
        try {
            response = await fetch(url, {method: "get"});
            payload = await response.json();
        } catch (e) {
            this.setState({error: "Failed to connect to server, code " + e})
            return;
        }

        if (response.status !== 200) {
            this.setState({error: "Error connecting to server, code " + e})
            return;
        }

        //If all went fine we can set players
        this.setState({players: payload});
    };

    render() {
        if (this.state.error) {
            return <p className={"alert alert-danger"}>Error : {this.state.error}</p>;
        }

        //If players are not yet fetched from server
        if (!this.state.players || this.state.players.size === 0) {
            return <p className={"alert alert-warning"}>Loading...</p>
        }

        return (
            <div style={{display:"inline-block"}}>
                <h1>All collectiables</h1>
                {this.state.players.map((player, index) => {
                    return (<div key={index + "player-card"} className={"alert alert-info"}>
                        <p>{index + 1}.</p>
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

}
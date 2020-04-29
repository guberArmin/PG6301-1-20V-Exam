import React from "react"

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
            this.setState({error: "Failed to connect to server:" + e});
            return;
        }

        if (response.status !== 200) {
            this.setState({error: "Error connecting to server, code " + response.status})
            return;
        }

        //If all went fine we can set players
        this.setState({players: payload});
    };

    render() {
        if (this.state.error) {
            return <p id={"failureParagraph"} className={"alert alert-danger"}>Error : {this.state.error}</p>;
        }

        //If players are not yet fetched from server
        if (!this.state.players || this.state.players.size === 0) {
            return <p className={"alert alert-warning"}>Loading...</p>
        }

        return (
            <div className={"playerContainer"}>
                <h1>All collectibles</h1>
                {this.state.players.map((player, index) => {
                    return (<div key={index + "player-card"} className={"alert alert-info player-card"}>
                        <div className={"playerInfo"}>
                            <p>{index + 1}</p>
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
            </div>


        )
    }

}
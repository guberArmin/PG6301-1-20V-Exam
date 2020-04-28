import React from "react"
import {Link, withRouter} from 'react-router-dom'

export class Shop extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            error:null
        }
    }

    buyLootBox = async () =>{
        const url = "/api/players/loot";
        let response;

        try{
            response = await fetch(url, {method:"post"});
        }catch (e) {
            this.setState({error: "Failed to connect to server:" + e});
            return;
        }

        if (response.status === 400) {
            this.setState({error: "Failed buying box, insufficient funds: "});
            return;
        }

        if (response.status === 401) {
            //I have custom error for such situations so no handling it here
            return;
        }

        if (response.status !== 201) {
            this.setState({error: "Failed getting data: " + response.status});
            return;
        }
        //Lets update user info as geon amount is reduced
        this.props.fetchAndUpdateUserInfo();
    };


    render() {
        if (this.state.error) {
            return <p className={"alert alert-danger"}>Error : {this.state.error}</p>;
        }

        if (!this.props.user) {
            return (
                <div>
                    <p className={"alert alert-warning"}>To see your collection you have to
                        <Link role="button" to={"/login"} > login </Link> or you can <Link
                            role="button" to={"/description"}> view all collectibles </Link></p>
                </div>
            )
        }
        return (
            <div>
                <div className={"lootBoxShop"}>
                    <button onClick={this.buyLootBox} className={"btn btn-outline-success buyButton"}>Buy loot box</button>
                    <img src={"./logo.png"}/>
                    <p style={{textAlign:"center"}}><b>Price: 200 geons</b> </p>
                </div>
            </div>
        );
    }

}

export default withRouter(Shop);
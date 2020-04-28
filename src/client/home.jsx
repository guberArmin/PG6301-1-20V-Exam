import React from "react"
import {Link, withRouter} from 'react-router-dom'

class Home extends React.Component{
    constructor(props) {
        super(props);

    }

    render() {
        return <h1>To visit this page you have to login</h1>;
    }
}

export default withRouter(Home);
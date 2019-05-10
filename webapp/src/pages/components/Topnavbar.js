import React, { Component } from "react";
import "./Topnavbar.css";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

class Topnavbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contentChanged: false
        }
    }
    render() {
        return (
            <Navbar expand="lg">
                <Navbar.Brand>Note Taker</Navbar.Brand>
            </Navbar>
        );
    }
}

export default Topnavbar;
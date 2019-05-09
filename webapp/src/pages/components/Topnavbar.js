import React, { Component } from "react";
import "./Topnavbar.css";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import ButtonToolbar from "react-bootstrap/ButtonToolbar"
import Button from "react-bootstrap/Button";

class Topnavbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contentChanged: false
        }
    }
    enableSaveStatus() {
        const status = this.state.contentChanged
        if(!status) {
            this.setState({
                contentChanged: true
            })
        }
    }
    disableSaveStatus() {
        const status = this.state.contentChanged
        if(status) {
            this.setState({
                contentChanged: false
            })
        }
    }
    render() {
        return (
            <Navbar expand="lg">
                <Navbar.Brand>Note Taker</Navbar.Brand>
                <ButtonToolbar>
                    <Button variant="primary">New</Button>
                    <Button variant="success"
                        className={this.state.contentChanged ? "" : "hidden"}
                    >Save</Button>
                </ButtonToolbar>
            </Navbar>
        );
    }
}

export default Topnavbar;
import React, { Component, Fragment } from "react";
import "./App.css";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import { Link, withRouter } from "react-router-dom"
import Routes from "./Routes";
import LinkContainer from "react-router-bootstrap"

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isAuthenticated: false
        }
    }

    userHasAuthenticated(authenticated) {
        this.setState({ isAuthenticated: authenticated });
    }

    handleLogout() {
        console.log("Handle logout");
    }

    render() {
        const childProps = {
            isAuthenticated: this.state.isAuthenticated
        };

        return (
            <div className="App container">
                <Navbar bg="light" expand="lg">
                    <Navbar.Brand to="/Home">Notes Taker</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Link to="/login" className="btn btn-link">
                            Login</Link>
                        <Link to="/signup" className="btn btn-link">
                            Signup</Link>
                    </Navbar.Collapse>
                </Navbar>
                <Routes childProps={childProps} />
            </div>
        );
    }
}

export default withRouter(App);
import React, { Component, Fragment } from "react";
import "./App.css";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import { Link, withRouter } from "react-router-dom"
import Routes from "./Routes";
import LinkContainer from "react-router-bootstrap"
import { withCookies, Cookies } from "react-cookie";
import { instanceOf } from "prop-types";
import Home from "./pages/Home";


class App extends Component {

    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    constructor(props) {
        super(props);

        const { cookies } = props;

        this.state = {
            isAuthenticated: false,
            cookies: cookies
        };

        this.userHasAuthenticated = this.userHasAuthenticated.bind(this);
    }

    userHasAuthenticated(authenticated) {
        this.setState({ isAuthenticated: authenticated });
    }

    handleLogout() {
        this.props.cookies.remove('current session', {path: '/'});
        this.setState({isAuthenticated: false});
        console.log("Handle logout");
    }

    render() {
        const childProps = {
            isAuthenticated: this.state.isAuthenticated,
            cookies: this.state.cookies,
            authenticator: this.userHasAuthenticated
        };

        let loggedIn;

        loggedIn = !!this.props.cookies.get('current session');

        return (
            <div className="App container">
                <Navbar bg="light" expand="lg">
                    <Navbar.Brand to="/Home">Notes Taker</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        {loggedIn ? (
                            <Link to="/login" className="btn btn-link" onClick={() => this.handleLogout()}>
                                Logout</Link>
                        ) : (
                            <Link to="/login" className="btn btn-link">
                                Login</Link>
                        )}
                        {loggedIn ? (
                            <Link to="/signup" className="btn btn-link disabled">
                            Signup</Link>
                        ) : (
                            <Link to="/signup" className="btn btn-link">
                            Signup</Link>
                        )}
                    </Navbar.Collapse>
                </Navbar>
                <Routes childProps={childProps} />
            </div>
        );
    }
}

export default withCookies(withRouter(App));

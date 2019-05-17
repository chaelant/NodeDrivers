import React, { Component } from "react";
import { FormGroup, FormControl, FormLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import "./Login.css";
import { Redirect } from 'react-router';
import { validateUser } from "../../auth/userAuth";

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      email: "",
      password: "",
      loginSuccess: false,
    };
    //this.props.cookies.remove('mikeramos92@gmail.com', {path: '/'});
    console.log(this.props.isAuthenticated);
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleSubmit = async event => {
    event.preventDefault();

    this.setState({ isLoading: true });

    const credentialsMatch = await validateUser(this.state.email, this.state.password);
    console.log(credentialsMatch);

      if (!credentialsMatch) {
          alert('Email and/or password do not match. Please try again');
          this.setState({isLoading: false});
      } else {
          this.props.cookies.set('current session', this.state.email, '/');
          this.props.authenticator(true);
          this.setState({loginSuccess: true});
          console.log(this.props);
      }

  };

  render() {
    if (this.state.loginSuccess) {
      return <Redirect push to="/notes" />;
    }
    return (
      <div className="Login">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="email">
            <FormLabel>Email</FormLabel>
            <FormControl
              autoFocus
              type="email"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="password">
            <FormLabel>Password</FormLabel>
            <FormControl
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          <LoaderButton
            block
            disabled={!this.validateForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Login"
            loadingText="Logging in…"
          />
        </form>
      </div>
    );
  }
}

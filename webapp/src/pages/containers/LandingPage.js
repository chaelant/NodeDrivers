import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";

export default class LandingPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      notes: []
    };
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }

    try {
      const notes = await this.notes();
      this.setState({ notes });
    } catch (e) {
      alert(e);
    }

    this.setState({ isLoading: false });
  }

  render() {
    return (
      <div className="Home">
       <div className="lander">
        <h1>A note taking app</h1>
        <p>Please Login to proceed</p>
        <div>
          <Link to="/login" className="btn btn-primary btn-lg">
            Login
          </Link>
          <Link to="/signup" className="btn btn-secondary btn-lg">
            Signup
          </Link>
        </div>
      </div>
      </div>
    );
  }
}

import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "../src/pages/Home";
import Login from "../src/pages/containers/Login";
import Signup from "../src/pages/containers/Signup";
import LandingPage from "../src/pages/containers/LandingPage"
import AppliedRoute from "../src/pages/components/AppliedRoute";

export default ({ childProps }) =>
  <Switch>
    <AppliedRoute path="/" exact component={LandingPage} props={childProps} />
    <AppliedRoute path="/login" exact component={Login} props={childProps} />
    <AppliedRoute path="/signup" exact component={Signup} props={childProps} />
    <AppliedRoute path="/notes" exact component={Home} props={childProps} />
  </Switch>;

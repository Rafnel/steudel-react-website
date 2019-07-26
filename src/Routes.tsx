import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import WeatherPage from "./containers/WeatherPage";
import NotFound from "./containers/NotFound";
import { HomePage } from "./containers/HomePage";
import { LoginPage } from "./containers/LoginPage";
import { SignupPage } from "./containers/SignupPage";
import { mainStore } from "./App";

export default () =>
  <Switch>
    <Route path="/" exact component={HomePage} />
    <Route path="/login" exact component={mainStore.isLoggedIn ? HomePage : LoginPage} />
    <Route path="/signup" exact component={mainStore.isLoggedIn ? HomePage : SignupPage} />
    <Route path="/weather" exact component={WeatherPage} />
    { /* Finally, catch all unmatched routes */ }
    <Route component={NotFound} />
  </Switch>;

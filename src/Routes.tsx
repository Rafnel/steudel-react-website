import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import WeatherPage from "./containers/WeatherPage";
import { HomePage } from "./containers/HomePage";
import SignupPage from "./containers/SignupPage";
import AppStateStore, { appState } from "./stateStores/appState";
import LoginPage from "./containers/LoginPage";

export default class Routes extends React.Component{
  render(){
    return(
      <Switch>
        <Route path="/" exact render = {() => <HomePage/>} />
        {!appState.isLoggedIn 
          && 
          <Route path="/login" exact render = {() => <LoginPage/>}/>}
        {!appState.isLoggedIn 
          && 
          <Route path="/signup" exact render={() => <SignupPage/>}/>}
        <Route path="/weather" exact component={WeatherPage} />
        { /* Finally, catch all unmatched routes */ }
        <Route render = {() => <Redirect to = "/"/>} />
      </Switch>
    )
  }
  
}

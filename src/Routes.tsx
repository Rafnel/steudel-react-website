import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import WeatherPage from "./containers/WeatherPage";
import { HomePage } from "./containers/HomePage";
import SignupPage from "./containers/SignupPage";
import AppStateStore from "./stateStores/appState";
import LoginPage from "./containers/LoginPage";

export interface RoutesProps{
  appState: AppStateStore;
}

export default class Routes extends React.Component<RoutesProps>{
  render(){
    return(
      <Switch>
        <Route path="/" exact render = {() => <HomePage appState = {this.props.appState}/>} />
        {!this.props.appState.isLoggedIn 
          && 
          <Route path="/login" exact render = {() => <LoginPage appState = {this.props.appState}/>}/>}
        {!this.props.appState.isLoggedIn 
          && 
          <Route path="/signup" exact render={() => <SignupPage appState = {this.props.appState}/>}/>}
        <Route path="/weather" exact component={WeatherPage} />
        { /* Finally, catch all unmatched routes */ }
        <Route render = {() => <Redirect to = "/"/>} />
      </Switch>
    )
  }
  
}

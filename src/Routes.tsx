import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import WeatherPage from "./containers/WeatherPage";
import SignupPage from "./containers/SignupPage";
import LoginPage from "./containers/LoginPage";
import { globalState } from "./stateStores/appState";
import HomePage from "./containers/HomePage";
import CreateSwimComponentPage from "./containers/CreateSwimComponentPage";

export default class Routes extends React.Component{
  render(){
    return(
      <Switch>
        <Route path="/" exact render = {() => <HomePage/>} />
        {!globalState.appState.isLoggedIn 
          && 
          <Route path="/login" exact render = {() => <LoginPage/>}/>}
        {!globalState.appState.isLoggedIn 
          && 
          <Route path="/signup" exact render={() => <SignupPage/>}/>}
        {globalState.appState.isLoggedIn 
         && 
         <Route path="/create-swim-component" exact render={() => <CreateSwimComponentPage/>}/>}
        <Route path="/weather" exact component={WeatherPage} />
        { /* Finally, catch all unmatched routes */ }
        <Route render = {() => <Redirect to = "/"/>} />
      </Switch>
    )
  }
  
}

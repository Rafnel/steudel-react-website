import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import WeatherPage from "./WeatherPage";
import SignupPage from "./SignupPage";
import LoginPage from "./LoginPage";
import HomePage from "./HomePage";
import CreateSwimComponentPage from "./CreateSwimComponentPage";
import SwimComponentsPage from "./SwimComponentsPage";
import CreateSwimWorkoutPage from "./CreateSwimWorkoutPage";
import { globalState } from "../configuration/appState";
import ContactPage from "./ContactPage";

export default class Routes extends React.Component{
  render(){
    return(
      <Switch>
        <Route path="/" exact render = {() => <HomePage/>} />
        <Route path="/contact" exact render = {() => <ContactPage/>} />
        {!globalState.appState.isLoggedIn 
          && 
          <Route path="/login" exact render = {() => <LoginPage/>}/>}
        {!globalState.appState.isLoggedIn 
          && 
          <Route path="/signup" exact render={() => <SignupPage/>}/>}
        {globalState.appState.isLoggedIn 
         && 
         <Route path="/create-swim-workout" exact render={() => <CreateSwimWorkoutPage/>}/>}
        {globalState.appState.isLoggedIn 
         && 
         <Route path="/create-swim-component" exact render={() => <CreateSwimComponentPage/>}/>}
        {globalState.appState.isLoggedIn 
         && 
         <Route path="/swim-components" exact render={() => <SwimComponentsPage/>}/>}
        <Route path="/weather" exact component={WeatherPage} />
        { /* Finally, catch all unmatched routes */ }
        <Route render = {() => <Redirect to = "/"/>} />
      </Switch>
    )
  }
  
}

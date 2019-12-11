import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import SignupPage from "./SignupPage";
import LoginPage from "./LoginPage";
import HomePage from "./HomePage";
import CreateSwimComponentPage from "./CreateSwimComponentPage";
import SwimComponentsPage from "./SwimComponentsPage";
import CreateSwimWorkoutPage from "./CreateSwimWorkoutPage";
import ContactPage from "./ContactPage";
import AboutPage from "./AboutPage";
import MyWorkoutsPage from "./MyWorkoutsPage";
import SingleWorkoutPage from "./SingleWorkoutPage";
import { observer, inject } from "mobx-react";
import { AppStateStore } from "../configuration/stateStores/appStateStore";

export interface RoutesProps{
  appState?: AppStateStore;
}

//updated
@inject("appState")
@observer
export default class Routes extends React.Component<RoutesProps>{
  get appState(){
    return this.props.appState as AppStateStore;
  }

  render(){
    return(
      <Switch>
        <Route path="/" exact render = {() => <HomePage/>} />
        <Route path="/contact" exact render = {() => <ContactPage/>} />
        <Route path="/about" exact render = {() => <AboutPage/>} />
        {this.appState.isLoggedIn 
          && 
          <Route path="/workout/:username/:id" exact render = {(props) => {
            return <SingleWorkoutPage username = {props.match.params.username} workoutID = {props.match.params.id}/>
          }}/>}
        {!this.appState.isLoggedIn && 
          <Route path="/workout/:username/:id" exact render = {(props) => {
            this.appState.redirectAfterLogin = "/workout/" + props.match.params.username + "/" + props.match.params.id;
            return <LoginPage/>;
          }}/>
        }
        {this.appState.isLoggedIn 
          && 
          <Route path="/my-workouts" exact render = {() => <MyWorkoutsPage/>}/>}
        {!this.appState.isLoggedIn 
          && 
          <Route path="/login" exact render = {() => <LoginPage/>}/>}
        {!this.appState.isLoggedIn 
          && 
          <Route path="/signup" exact render={() => <SignupPage/>}/>}
        {this.appState.isLoggedIn 
         && 
         <Route path="/create-swim-workout" exact render={() => <CreateSwimWorkoutPage/>}/>}
        {this.appState.isLoggedIn 
         && 
         <Route path="/create-swim-component" exact render={() => <CreateSwimComponentPage/>}/>}
        {this.appState.isLoggedIn 
         && 
         <Route path="/swim-components" exact render={() => <SwimComponentsPage/>}/>}
        { /* Finally, catch all unmatched routes */ }
        <Route render = {() => <Redirect to = "/"/>} />
      </Switch>
    )
  }
}

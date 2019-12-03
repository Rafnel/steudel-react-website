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
import AboutPage from "./AboutPage";
import MyWorkoutsPage from "./MyWorkoutsPage";
import SingleWorkoutPage from "./SingleWorkoutPage";

export default class Routes extends React.Component{
  render(){
    return(
      <Switch>
        <Route path="/" exact render = {() => <HomePage/>} />
        <Route path="/contact" exact render = {() => <ContactPage/>} />
        <Route path="/about" exact render = {() => <AboutPage/>} />
        {globalState.appState.isLoggedIn 
          && 
          <Route path="/workout/:username/:id" exact render = {(props) => {
            return <SingleWorkoutPage username = {props.match.params.username} workoutID = {props.match.params.id}/>
          }}/>}
        {!globalState.appState.isLoggedIn && 
          <Route path="/workout/:username/:id" exact render = {(props) => {
            globalState.appState.redirectAfterLogin = "/workout/" + props.match.params.username + "/" + props.match.params.id;
            return <LoginPage/>;
          }}/>
        }
        {globalState.appState.isLoggedIn 
          && 
          <Route path="/my-workouts" exact render = {() => <MyWorkoutsPage/>}/>}
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

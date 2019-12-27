import React from "react";
import { Route, Switch, Redirect, RouteComponentProps, withRouter } from "react-router-dom";
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
import WorkoutFolderPage, { updateFolderPage } from "./WorkoutFolderPage";
import UserStateStore from "../configuration/stateStores/userStateStore";
import NotFoundPage from "./NotFoundPage";

export interface RoutesProps{
  appState?: AppStateStore;
  userState?: UserStateStore;
}

//updated
@inject("appState", "userState")
@observer
class Routes extends React.Component<RoutesProps & RouteComponentProps<any>>{
  get appState(){
    return this.props.appState as AppStateStore;
  }

  get userState(){
    return this.props.userState as UserStateStore;
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
        {this.appState.isLoggedIn 
          && 
          <Route path="/folder/:username/:folder" exact render = {(props) => {
            //updateFolderPage(props.match.params.username, props.match.params.folder, this.userState, this.appState);
            return <WorkoutFolderPage key = {props.match.params.username + " " + props.match.params.folder} username = {props.match.params.username} folder_name = {props.match.params.folder}/>
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
        <Route render = {() => { return <NotFoundPage/> }} />
      </Switch>
    )
  }
}

export default withRouter<RoutesProps & RouteComponentProps<any>, any>(Routes);
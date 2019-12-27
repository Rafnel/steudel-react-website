import { Button, CircularProgress, Grid, TextField, Typography, Chip } from "@material-ui/core";
import { Auth } from "aws-amplify";
import { observer, inject } from "mobx-react";
import React from "react";
import { RouteComponentProps, withRouter } from 'react-router-dom';
import EmailVerification from "../components/EmailVerification";
import ForgotPassword from "../components/ForgotPassword";
import UIStateStore from "../configuration/stateStores/uiStateStore";
import UserStateStore from "../configuration/stateStores/userStateStore";
import { AppStateStore } from "../configuration/stateStores/appStateStore";
import { signUserIn } from "../configuration/cognitoAPI";
import addNewSwimFolder from "../api/addNewSwimFolder";

export interface LoginPageProps{
    uiState?: UIStateStore;
    userState?: UserStateStore;
    appState?: AppStateStore;
}

//updated
@inject("uiState", "userState", "appState")
@observer
class LoginPage extends React.Component<RouteComponentProps<any> & LoginPageProps>{
    password: string = "";
    email: string = "";

    get uiState(){
        return this.props.uiState as UIStateStore;
    }

    get userState(){
        return this.props.userState as UserStateStore;
    }

    get appState(){
        return this.props.appState as AppStateStore;
    }

    handleLogin = async (event: any) =>{
        this.appState.isLoading = true;
        event.preventDefault();

        if(this.email.length === 0){
            this.uiState.setErrorMessage("Please enter your Email or username.");
        }
        else if(this.password.length === 0){
            this.uiState.setErrorMessage("Please enter a password.");
        }

        //sign the user in.
        let loginStatusObject = await signUserIn(this.email, this.password);
        if(loginStatusObject.status === false){
            //login failed.
            this.uiState.setErrorMessage(loginStatusObject.message);
        }
        else{
            //login succeeded, change the state
            this.uiState.setSuccessMessage("Welcome back " + loginStatusObject.user.username + "!");
            this.userState.currentUser = loginStatusObject.user;
            //ensure that they have a main folder for workouts.
            await addNewSwimFolder(this.userState.currentUser.username, "main", "none");

            if(this.appState.redirectAfterLogin !== ""){
                //if we are to redirect the user somewhere, redirect them here.
                this.props.history.push(this.appState.redirectAfterLogin);
            }
            else{
                //redirect user to dashboard
                this.props.history.push("/");
            }
            this.appState.isLoggedIn = true;
        }

        this.appState.isLoading = false;
    }

    render(){
        return(
            <Grid container spacing = {2} direction = "column" justify = "center" alignItems = "center">
                <Grid item>
                    <Typography variant = "h2">Rafnel Login</Typography>
                </Grid>

                {this.appState.redirectAfterLogin !== "" && 
                    <Grid item>
                        <Chip label = "Please log in or create an account to access the workout." color = "primary"/>
                    </Grid>
                }

                <Grid container direction = "row" spacing = {1} justify = "center" alignItems = "center">
                    <Grid item>
                        <TextField
                            onChange = {event => {this.email = (event.target as HTMLInputElement).value}}
                            name = "email"
                            type = "email"
                            margin = "dense"
                            variant = "outlined"
                            onKeyPress = {(event) => {
                                if(event.key === "Enter"){
                                    this.handleLogin(event);
                                }
                            }}
                            label = "Email / Username"
                        >
                        </TextField>  
                    </Grid>
                    

                    <Grid item>
                        <TextField
                            onChange = {event => this.password = (event.target as HTMLInputElement).value}
                            name = "password"
                            type = "password"
                            autoComplete = "current-password"
                            margin = "dense"
                            variant = "outlined"
                            onKeyPress = {(event) => {
                                if(event.key === "Enter"){
                                    this.handleLogin(event);
                                }
                            }}
                            label = "Password"
                        >
                        </TextField>  
                    </Grid>
                </Grid>

                <Grid item>
                    <Button 
                        variant = "contained" 
                        color = "primary"
                        onClick = {this.handleLogin}
                        disabled = {this.appState.isLoading}
                    >
                        Log in
                    </Button>
                </Grid>

                <Grid item>
                    {this.appState.isLoading ? <CircularProgress/> : null}
                </Grid>

                <Grid item>
                    <EmailVerification/>
                </Grid>

                <Grid item>
                    <ForgotPassword/>
                </Grid>

            </Grid>
        )
    }
}

export default withRouter<RouteComponentProps<any> & LoginPageProps, any>(LoginPage);
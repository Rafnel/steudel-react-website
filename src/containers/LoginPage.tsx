import { Typography, Grid, TextField, Button, CircularProgress, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from "@material-ui/core";
import React from "react";
import { observer } from "mobx-react";
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Auth } from "aws-amplify";
import AppStateStore, { appState } from "../stateStores/appState";
import EmailVerification from "../components/EmailVerification";
import { Message } from "primereact/components/message/Message";
import winston from "../logging";
import ForgotPassword from "../components/ForgotPassword";

@observer
class LoginPage extends React.Component<RouteComponentProps<any>>{
    password: string = "";
    handleLogin = async (event: any) =>{
        appState.isLoading = true;
        event.preventDefault();

        if(appState.email.length === 0){
            appState.loginPageErrorMessage = "Please enter your Email or username.";
        }
        else if(this.password.length === 0){
            appState.loginPageErrorMessage = "Please enter a password.";
        }
        else{
            try{
                await Auth.signIn(appState.email, this.password);
                const currentUserInfo = await Auth.currentUserInfo();
        
                appState.username = currentUserInfo.username;
                winston.info("User " + appState.username + " has logged in at " + new Date().toLocaleString("en-US", {timeZone: "America/Denver"}));
                appState.successMessage = "Successfully logged in. Welcome back " + appState.username + "!";
                this.props.history.push("/");
                appState.isLoggedIn = true;
            }
            catch(e){
                appState.loginPageErrorMessage = e.message;
            }
        }
        appState.isLoading = false;
    }

    render(){
        return(
            <Grid container spacing = {2} direction = "column" justify = "center" alignItems = "center">
                <Grid item>
                    <Typography variant = "h2">Rafnel Login</Typography>
                </Grid>
                {appState.loginPageErrorMessage.length != 0 && <Message severity = "error" text = {appState.loginPageErrorMessage}/>}
                <Grid container direction = "row" spacing = {1} justify = "center" alignItems = "center">
                    <Grid item>
                        <TextField
                            onChange = {event => {appState.email = (event.target as HTMLInputElement).value}}
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
                        disabled = {appState.isLoading}
                    >
                        Log in
                    </Button>
                </Grid>

                <Grid item>
                    {appState.isLoading ? <CircularProgress/> : null}
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

    componentWillUnmount(){
        appState.loginPageErrorMessage = "";
    }
}

export default withRouter<RouteComponentProps<any>, any>(LoginPage);
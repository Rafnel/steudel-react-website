import { Typography, Grid, TextField, Button, CircularProgress, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from "@material-ui/core";
import React from "react";
import { observer } from "mobx-react";
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Auth } from "aws-amplify";
import AppStateStore from "../stateStores/appState";
import EmailVerification from "../components/EmailVerification";
import { Message } from "primereact/components/message/Message";
import winston from "../logging";
import ForgotPassword from "../components/ForgotPassword";

export interface LoginPageProps extends RouteComponentProps<any>{
    appState: AppStateStore;
}

@observer
class LoginPage extends React.Component<LoginPageProps>{
    password: string = "";
    handleLogin = async (event: any) =>{
        this.props.appState.isLoading = true;
        event.preventDefault();

        if(this.props.appState.email.length === 0){
            this.props.appState.loginPageErrorMessage = "Please enter your Email or username.";
        }
        else if(this.password.length === 0){
            this.props.appState.loginPageErrorMessage = "Please enter a password.";
        }
        else{
            try{
                await Auth.signIn(this.props.appState.email, this.password);
                const currentUserInfo = await Auth.currentUserInfo();
        
                this.props.appState.username = currentUserInfo.username;
                winston.info("User " + this.props.appState.username + " has logged in at " + new Date().toLocaleString("en-US", {timeZone: "America/Denver"}));
                this.props.appState.successMessage = "Successfully logged in. Welcome back " + this.props.appState.username + "!";
                this.props.history.push("/");
                this.props.appState.isLoggedIn = true;
            }
            catch(e){
                this.props.appState.loginPageErrorMessage = e.message;
            }
        }
        this.props.appState.isLoading = false;
    }

    render(){
        return(
            <Grid container spacing = {2} direction = "column" justify = "center" alignItems = "center">
                <Grid item>
                    <Typography variant = "h2">Rafnel Login</Typography>
                </Grid>
                {this.props.appState.loginPageErrorMessage.length != 0 && <Message severity = "error" text = {this.props.appState.loginPageErrorMessage}/>}
                <Grid container direction = "row" spacing = {1} justify = "center" alignItems = "center">
                    <Grid item>
                        <TextField
                            onChange = {event => {this.props.appState.email = (event.target as HTMLInputElement).value}}
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
                        disabled = {this.props.appState.isLoading}
                    >
                        Log in
                    </Button>
                </Grid>

                <Grid item>
                    {this.props.appState.isLoading ? <CircularProgress/> : null}
                </Grid>

                <Grid item>
                    <EmailVerification appState = {this.props.appState}/>
                </Grid>

                <Grid item>
                    <ForgotPassword appState = {this.props.appState}/>
                </Grid>

            </Grid>
        )
    }

    componentWillUnmount(){
        this.props.appState.loginPageErrorMessage = "";
    }
}

export default withRouter<LoginPageProps, any>(LoginPage);
import React, { Fragment } from "react";
import { observer } from "mobx-react";
import AppStateStore, { appState } from "../stateStores/appState";
import { ExpansionPanel, ExpansionPanelSummary, Typography, ExpansionPanelDetails, Grid, Button, TextField, CircularProgress } from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Auth } from 'aws-amplify';
import { Message } from "primereact/components/message/Message";
import { RouteComponentProps, withRouter } from "react-router-dom";
import winston from "../logging";

@observer
class ForgotPassword extends React.Component<RouteComponentProps<any>>{
    password: string = "";
    confirmPassword: string = "";
    emailOrUsername: string = "";

    async sendForgotEmail(){
        appState.forgotPasswordErrorMessage = "";
        appState.loadingForgotPassword = true;
        try{
            await Auth.forgotPassword(this.emailOrUsername);
            appState.successMessage = "Password reset email was sent successfully.";
            appState.forgotPasswordUsernameEntered = true;
            appState.forgotPasswordErrorMessage = "";
        }
        catch(e){
            let message: string = e.message;
            message = message.replace("client id", "email");
            appState.forgotPasswordErrorMessage = e.message;
        }
        appState.loadingForgotPassword = false;
    }

    async verifyReset(){
        appState.forgotPasswordErrorMessage = "";
        appState.loadingForgotPassword = true;
        try{
            await Auth.forgotPasswordSubmit(this.emailOrUsername, appState.verificationCode, this.password);
            await Auth.signIn(this.emailOrUsername, this.password);

            const currentUserInfo = await Auth.currentUserInfo();
            appState.username = currentUserInfo.username;
            appState.successMessage = "Password reset successful. Welcome back " + appState.username + "!";

            appState.isLoggedIn = true;
            this.props.history.push("/");
            winston.info("User " + appState.username + " reset their password and logged in at " + new Date().toLocaleString("en-US", {timeZone: "America/Denver"}));
        }
        catch(e){
            appState.forgotPasswordErrorMessage = e.message;
        }
        appState.loadingForgotPassword = false;
    }

    validateUsername(): boolean{
        if(this.emailOrUsername.length === 0){
            appState.forgotPasswordErrorMessage = "Email / username field must not be empty.";
            return false;
        }

        return true;
    }

    validatePasswordReset(): boolean{
        if(appState.verificationCode.length === 0){
            appState.forgotPasswordErrorMessage = "Verification code field must not be empty.";
            return false;
        }

        if(this.password.length === 0 || this.confirmPassword.length === 0){
            appState.forgotPasswordErrorMessage = "Password fields must not be empty.";
            return false;
        }
        
        if(this.password !== this.confirmPassword){
            appState.forgotPasswordErrorMessage = "Passwords must match.";
            return false;
        }

        if(this.password.length < 8){
            appState.forgotPasswordErrorMessage = "Password must be 8 characters or greater.";
            return false;
        }

        return true;
    }

    renderPasswordReset(){
        return(
            <Fragment>
                <Grid item>
                    <TextField
                        onChange = {event => appState.verificationCode = (event.target as HTMLInputElement).value}
                        name = "verificationCode"
                        type = "verificationCode"
                        margin = "dense"
                        variant = "outlined"
                        label = "Verification Code"
                        onKeyPress = {(event) => {
                            if(event.key === "Enter"){
                                if(this.validatePasswordReset()){
                                    this.verifyReset();
                                }
                            }
                        }}
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
                        label = "New Password"
                        onKeyPress = {(event) => {
                            if(event.key === "Enter"){
                                if(this.validatePasswordReset()){
                                    this.verifyReset();
                                }
                            }
                        }}
                    >
                    </TextField>  
                </Grid>

                <Grid item>
                    <TextField
                        onChange = {event => this.confirmPassword = (event.target as HTMLInputElement).value}
                        name = "password"
                        type = "password"
                        autoComplete = "current-password"
                        margin = "dense"
                        variant = "outlined"
                        label = "Confirm New Password"
                        onKeyPress = {(event) => {
                            if(event.key === "Enter"){
                                if(this.validatePasswordReset()){
                                    this.verifyReset();
                                }
                            }
                        }}
                    >
                    </TextField>  
                </Grid>

                <Grid item>
                    <Button 
                        variant = "contained" 
                        color = "primary"
                        disabled = {appState.loadingForgotPassword}
                        onClick = {() => {
                            if(this.validatePasswordReset()){
                                this.verifyReset();
                            }
                        }}
                    >
                        Submit New Password
                    </Button>
                </Grid>
            </Fragment>
        )
    }

    render(){
        return(
            <ExpansionPanel>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant = "h6">I forgot my password</Typography>
                </ExpansionPanelSummary>

                <ExpansionPanelDetails>
                    <Grid container spacing = {2} direction = "column" justify = "center" alignItems = "center">
                        {appState.forgotPasswordErrorMessage.length !== 0 && <Message severity = "error" text = {appState.forgotPasswordErrorMessage}/>}
                        <Grid item>
                            <TextField
                                onChange = {event => this.emailOrUsername = (event.target as HTMLInputElement).value}
                                name = "username"
                                type = "username"
                                margin = "dense"
                                variant = "outlined"
                                label = "Email / Username"
                                onKeyPress = {(event) => {
                                    if(event.key === "Enter"){
                                        if(this.validateUsername()){
                                            this.sendForgotEmail();
                                        }
                                    }
                                }}
                            >
                            </TextField> 
                        </Grid>

                        <Grid item>
                            <Button 
                                variant = "contained" 
                                color = "default"
                                disabled = {appState.loadingForgotPassword}
                                onClick = {() => {
                                    if(this.validateUsername()){
                                        this.sendForgotEmail();
                                    }
                                }}
                            >
                                Send reset email
                            </Button>
                        </Grid>

                        {appState.forgotPasswordUsernameEntered && this.renderPasswordReset()}

                        <Grid item>
                            {appState.loadingForgotPassword ? <CircularProgress/> : null}
                        </Grid>

                    </Grid>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        )
    }

    componentWillUnmount(){
        appState.forgotPasswordErrorMessage = "";
        appState.forgotPasswordUsernameEntered = false;
    }
}

export default withRouter<RouteComponentProps<any>, any>(ForgotPassword);
import { Button, CircularProgress, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Grid, TextField, Typography } from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Auth } from 'aws-amplify';
import { observer } from "mobx-react";
import { Message } from "primereact/components/message/Message";
import React, { Fragment } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import winston from "../logging";
import { globalState } from "../stateStores/appState";


@observer
class ForgotPassword extends React.Component<RouteComponentProps<any>>{
    password: string = "";
    confirmPassword: string = "";
    emailOrUsername: string = "";

    async sendForgotEmail(){
        globalState.appState.forgotPasswordErrorMessage = "";
        globalState.appState.loadingForgotPassword = true;
        try{
            await Auth.forgotPassword(this.emailOrUsername);
            globalState.appState.successMessage = "Password reset email was sent successfully.";
            globalState.appState.forgotPasswordUsernameEntered = true;
            globalState.appState.forgotPasswordErrorMessage = "";
        }
        catch(e){
            let message: string = e.message;
            message = message.replace("client id", "email");
            globalState.appState.forgotPasswordErrorMessage = message;
        }
        globalState.appState.loadingForgotPassword = false;
    }

    async verifyReset(){
        globalState.appState.forgotPasswordErrorMessage = "";
        globalState.appState.loadingForgotPassword = true;
        try{
            await Auth.forgotPasswordSubmit(this.emailOrUsername, globalState.appState.verificationCode, this.password);
            await Auth.signIn(this.emailOrUsername, this.password);

            const currentUserInfo = await Auth.currentUserInfo();
            globalState.appState.username = currentUserInfo.username;
            globalState.appState.successMessage = "Password reset successful. Welcome back " + globalState.appState.username + "!";

            globalState.appState.isLoggedIn = true;
            this.props.history.push("/");
            winston.info("User " + globalState.appState.username + " reset their password and logged in at " + new Date().toLocaleString("en-US", {timeZone: "America/Denver"}));
        }
        catch(e){
            globalState.appState.forgotPasswordErrorMessage = e.message;
        }
        globalState.appState.loadingForgotPassword = false;
    }

    validateUsername(): boolean{
        if(this.emailOrUsername.length === 0){
            globalState.appState.forgotPasswordErrorMessage = "Email / username field must not be empty.";
            return false;
        }

        return true;
    }

    validatePasswordReset(): boolean{
        if(globalState.appState.verificationCode.length === 0){
            globalState.appState.forgotPasswordErrorMessage = "Verification code field must not be empty.";
            return false;
        }

        if(this.password.length === 0 || this.confirmPassword.length === 0){
            globalState.appState.forgotPasswordErrorMessage = "Password fields must not be empty.";
            return false;
        }
        
        if(this.password !== this.confirmPassword){
            globalState.appState.forgotPasswordErrorMessage = "Passwords must match.";
            return false;
        }

        if(this.password.length < 8){
            globalState.appState.forgotPasswordErrorMessage = "Password must be 8 characters or greater.";
            return false;
        }

        return true;
    }

    renderPasswordReset(){
        return(
            <Fragment>
                <Grid item>
                    <TextField
                        onChange = {event => globalState.appState.verificationCode = (event.target as HTMLInputElement).value}
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
                        disabled = {globalState.appState.loadingForgotPassword}
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
                        {globalState.appState.forgotPasswordErrorMessage.length !== 0 && <Message severity = "error" text = {globalState.appState.forgotPasswordErrorMessage}/>}
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
                                disabled = {globalState.appState.loadingForgotPassword}
                                onClick = {() => {
                                    if(this.validateUsername()){
                                        this.sendForgotEmail();
                                    }
                                }}
                            >
                                Send reset email
                            </Button>
                        </Grid>

                        {globalState.appState.forgotPasswordUsernameEntered && this.renderPasswordReset()}

                        <Grid item>
                            {globalState.appState.loadingForgotPassword ? <CircularProgress/> : null}
                        </Grid>

                    </Grid>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        )
    }

    componentWillUnmount(){
        globalState.appState.forgotPasswordErrorMessage = "";
        globalState.appState.forgotPasswordUsernameEntered = false;
    }
}

export default withRouter<RouteComponentProps<any>, any>(ForgotPassword);
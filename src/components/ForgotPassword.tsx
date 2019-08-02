import React, { Fragment } from "react";
import { observer } from "mobx-react";
import AppStateStore from "../stateStores/appState";
import { ExpansionPanel, ExpansionPanelSummary, Typography, ExpansionPanelDetails, Grid, Button, TextField, CircularProgress } from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Auth } from 'aws-amplify';
import { Message } from "primereact/components/message/Message";
import { RouteComponentProps, withRouter } from "react-router-dom";
import winston from "../logging";


export interface ForgotPasswordProps extends RouteComponentProps<any>{
    appState: AppStateStore;
}

function forgotPasswordSpacing(){
    return <Fragment>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </Fragment>
}

@observer
class ForgotPassword extends React.Component<ForgotPasswordProps>{
    password: string = "";
    confirmPassword: string = "";
    emailOrUsername: string = "";

    async sendForgotEmail(){
        this.props.appState.loadingForgotPassword = true;
        try{
            await Auth.forgotPassword(this.emailOrUsername);
            this.props.appState.successMessage = "Password reset email was sent successfully.";
            this.props.appState.forgotPasswordUsernameEntered = true;
            this.props.appState.forgotPasswordErrorMessage = "";
        }
        catch(e){
            let message: string = e.message;
            message = message.replace("client id", "email");
            this.props.appState.forgotPasswordErrorMessage = e.message;
        }
        this.props.appState.loadingForgotPassword = false;
    }

    async verifyReset(){
        this.props.appState.loadingForgotPassword = true;
        try{
            await Auth.forgotPasswordSubmit(this.emailOrUsername, this.props.appState.verificationCode, this.password);
            await Auth.signIn(this.emailOrUsername, this.password);

            const currentUserInfo = await Auth.currentUserInfo();
            this.props.appState.username = currentUserInfo.username;
            this.props.appState.successMessage = "Password reset successful. Welcome back " + this.props.appState.username + "!";

            this.props.appState.isLoggedIn = true;
            this.props.history.push("/");
            winston.info("User " + this.props.appState.username + " reset their password and logged in at " + new Date().toLocaleString("en-US", {timeZone: "America/Denver"}));
        }
        catch(e){
            this.props.appState.forgotPasswordErrorMessage = e.message;
        }
        this.props.appState.loadingForgotPassword = false;
    }

    validateUsername(): boolean{
        if(this.emailOrUsername.length === 0){
            this.props.appState.forgotPasswordErrorMessage = "Email / username field must not be empty.";
            return false;
        }

        return true;
    }

    validatePasswordReset(): boolean{
        if(this.props.appState.verificationCode.length === 0){
            this.props.appState.forgotPasswordErrorMessage = "Verification code field must not be empty.";
            return false;
        }

        if(this.password.length === 0 || this.confirmPassword.length === 0){
            this.props.appState.forgotPasswordErrorMessage = "Password fields must not be empty.";
            return false;
        }
        
        if(this.password !== this.confirmPassword){
            this.props.appState.forgotPasswordErrorMessage = "Passwords must match.";
            return false;
        }

        if(this.password.length < 8){
            this.props.appState.forgotPasswordErrorMessage = "Password must be 8 characters or greater.";
            return false;
        }

        return true;
    }

    renderPasswordReset(){
        return(
            <Fragment>
                <Grid item>
                    <TextField
                        onChange = {event => this.props.appState.verificationCode = (event.target as HTMLInputElement).value}
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
                        label = "Password"
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
                        label = "Confirm Password"
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
                        disabled = {this.props.appState.loadingForgotPassword}
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
                    <Typography variant = "h6">{forgotPasswordSpacing()}I forgot my password{forgotPasswordSpacing()}</Typography>
                </ExpansionPanelSummary>

                <ExpansionPanelDetails>
                    <Grid container spacing = {2} direction = "column" justify = "center" alignItems = "center">
                        {this.props.appState.forgotPasswordErrorMessage.length !== 0 && <Message severity = "error" text = {this.props.appState.forgotPasswordErrorMessage}/>}
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
                                disabled = {this.props.appState.loadingForgotPassword}
                                onClick = {() => {
                                    if(this.validateUsername()){
                                        this.sendForgotEmail();
                                    }
                                }}
                            >
                                Send reset email
                            </Button>
                        </Grid>

                        {this.props.appState.forgotPasswordUsernameEntered && this.renderPasswordReset()}

                        <Grid item>
                            {this.props.appState.loadingForgotPassword ? <CircularProgress/> : null}
                        </Grid>

                    </Grid>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        )
    }

    componentWillUnmount(){
        this.props.appState.forgotPasswordErrorMessage = "";
        this.props.appState.forgotPasswordUsernameEntered = false;
    }
}

export default withRouter<ForgotPasswordProps, any>(ForgotPassword);
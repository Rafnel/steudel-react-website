import { Button, CircularProgress, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Grid, TextField, Typography } from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { observer, inject } from "mobx-react";
import React, { Fragment } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { validateVerificationCode, validatePassword } from "../configuration/loginSignup";
import UIStateStore from "../configuration/stateStores/uiStateStore";
import { observable } from "mobx";
import { sendPasswordForgotEmail, forgotPasswordChange, signUserIn } from "../configuration/cognitoAPI";
import UserStateStore from "../configuration/stateStores/userStateStore";
import { AppStateStore } from "../configuration/stateStores/appStateStore";

export interface ForgotPasswordProps{
    uiState?: UIStateStore;
    userState?: UserStateStore;
    appState?: AppStateStore;
}

//updated
@inject("uiState", "userState", "appState")
@observer
class ForgotPassword extends React.Component<RouteComponentProps<any> & ForgotPasswordProps>{
    password: string = "";
    confirmPassword: string = "";
    emailOrUsername: string = "";
    verificationCode: string = "";
    @observable loading: boolean = false;
    @observable emailSent: boolean = false;

    get uiState(){
        return this.props.uiState as UIStateStore;
    }

    get userState(){
        return this.props.userState as UserStateStore;
    }

    get appState(){
        return this.props.appState as AppStateStore;
    }

    async sendForgotEmail(){
        this.loading = true;
        
        let statusObject = await sendPasswordForgotEmail(this.emailOrUsername);

        if(statusObject.status === true){
            //email was sent correctly.
            this.emailSent = true;
            this.uiState.setSuccessMessage(statusObject.message);
        }
        else{
            //email was not sent.
            this.uiState.setErrorMessage(statusObject.message);
        }

        this.loading = false;
    }

    async verifyReset(){
        this.loading = true;

        //this will change user's password
        let statusObject = await forgotPasswordChange(this.emailOrUsername, this.verificationCode, this.password);

        if(statusObject.status === false){
            //password change failed.
            this.uiState.setErrorMessage(statusObject.message);
        }
        else{
            //password change succeeded.
            //sign them in.
            let loginStatus = await signUserIn(this.emailOrUsername, this.password);
            if(loginStatus.status === false){
                //login failed.
                this.uiState.setErrorMessage(loginStatus.message);
            }
            else{
                //login succeeded, change the state
                this.userState.currentUser = loginStatus.user;
                this.uiState.setSuccessMessage("Password change successful. Welcome back " + this.userState.currentUser.username + "!");

                this.props.history.push("/");
                this.appState.isLoggedIn = true;
            }
        }
        
        this.loading = false;
    }

    validateUsername(): boolean{
        if(this.emailOrUsername.length === 0){
            this.uiState.setErrorMessage("Email / username field must not be empty.");
            return false;
        }

        return true;
    }

    handlePasswordResetConfirmation(){
        let passwordValidationObject = validatePassword(this.password, this.confirmPassword);
        let verificationCodeValidationObject = validateVerificationCode(this.verificationCode);

        if(passwordValidationObject.status === false){
            //password validation failed. give the user an error message.
            this.uiState.setErrorMessage(passwordValidationObject.message);
        }
        else if(verificationCodeValidationObject.status === false){
            //verification code validation failed. give the user an error message.
            this.uiState.setErrorMessage(verificationCodeValidationObject.message);
        }
        else{
            //UI validation succeeded. send to verification function.
            this.verifyReset();
        }
    }

    renderPasswordReset(){
        return(
            <Fragment>
                <Grid item>
                    <TextField
                        onChange = {event => this.verificationCode = (event.target as HTMLInputElement).value}
                        name = "verificationCode"
                        type = "verificationCode"
                        margin = "dense"
                        variant = "outlined"
                        label = "Verification Code"
                        onKeyPress = {(event) => {
                            if(event.key === "Enter"){
                                this.handlePasswordResetConfirmation();
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
                                this.handlePasswordResetConfirmation();
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
                                this.handlePasswordResetConfirmation();
                            }
                        }}
                    >
                    </TextField>  
                </Grid>

                <Grid item>
                    <Button 
                        variant = "contained" 
                        color = "primary"
                        disabled = {this.loading}
                        onClick = {() => {
                            this.handlePasswordResetConfirmation();
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
                                disabled = {this.loading}
                                onClick = {() => {
                                    if(this.validateUsername()){
                                        this.sendForgotEmail();
                                    }
                                }}
                            >
                                Send reset email
                            </Button>
                        </Grid>

                        {this.emailSent && this.renderPasswordReset()}

                        <Grid item>
                            {this.loading ? <CircularProgress/> : null}
                        </Grid>

                    </Grid>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        )
    }
}

export default withRouter<RouteComponentProps<any> & ForgotPasswordProps, any>(ForgotPassword);
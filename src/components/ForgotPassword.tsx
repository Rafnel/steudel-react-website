import { Button, CircularProgress, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Grid, TextField, Typography } from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Auth } from 'aws-amplify';
import { observer } from "mobx-react";
import React, { Fragment } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { globalState } from "../configuration/appState";
import getUser from "../api/getUser";
import addUser from "../api/addUser";
import { validateVerificationCode, validatePassword, ensureUserInDB } from "../configuration/loginSignup";

@observer
class ForgotPassword extends React.Component<RouteComponentProps<any>>{
    password: string = "";
    confirmPassword: string = "";
    emailOrUsername: string = "";

    async sendForgotEmail(){
        globalState.appState.loadingForgotPassword = true;
        try{
            await Auth.forgotPassword(this.emailOrUsername);
            globalState.appState.successMessage = "Password reset email was sent successfully.";
            globalState.appState.forgotPasswordUsernameEntered = true;
        }
        catch(e){
            let message: string = e.message;
            message = message.replace("client id", "email");
            globalState.appState.errorMessage = message;
        }
        globalState.appState.loadingForgotPassword = false;
    }

    async verifyReset(){
        globalState.appState.loadingForgotPassword = true;
        try{
            await Auth.forgotPasswordSubmit(this.emailOrUsername, globalState.appState.verificationCode, this.password);
            await Auth.signIn(this.emailOrUsername, this.password);

            //function will ensure user is in our users database.
            await ensureUserInDB();
            globalState.appState.successMessage = "Password change successful. Welcome back " + globalState.appState.username + "!";

            globalState.appState.isLoggedIn = true;
            this.props.history.push("/");
        }
        catch(e){
            globalState.appState.errorMessage = e.message;
        }
        globalState.appState.loadingForgotPassword = false;
    }

    validateUsername(): boolean{
        if(this.emailOrUsername.length === 0){
            globalState.appState.errorMessage = "Email / username field must not be empty.";
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
                                if(validatePassword(this.password, this.confirmPassword) && validateVerificationCode()){
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
                                if(validatePassword(this.password, this.confirmPassword) && validateVerificationCode()){
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
                                if(validatePassword(this.password, this.confirmPassword) && validateVerificationCode()){
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
                            if(validatePassword(this.password, this.confirmPassword) && validateVerificationCode()){
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
        globalState.appState.forgotPasswordUsernameEntered = false;
    }
}

export default withRouter<RouteComponentProps<any>, any>(ForgotPassword);
import { Button, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Grid, TextField, Typography } from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Auth } from "aws-amplify";
import { observer } from "mobx-react";
import React from "react";
import { globalState } from "../configuration/appState";

@observer
export default class EmailVerification extends React.Component{
    async handleResend(){
        //check that the user entered a username
        if(globalState.appState.username.length === 0){
            globalState.appState.errorMessage = "Please enter a username to resend the confirmation code.";
        }
        //if they entered a username, attempt to resend email confirmation code.
        else{
            console.log("Resending confirmation code for username: " + globalState.appState.username);
            try{
                globalState.appState.isLoading = true;
                await Auth.resendSignUp(globalState.appState.username);
                globalState.appState.successMessage = "Verification code has been resent.";
                globalState.appState.isLoading = false;
            }
            catch(e){
                globalState.appState.errorMessage = e.message;
                globalState.appState.isLoading = false;
            }
        }   
    }

    async handleConfirmation(){
        if(globalState.appState.username.length === 0){
            globalState.appState.errorMessage = "Please enter a username to confirm your account.";
        }
        else if(globalState.appState.verificationCode.length === 0){
            globalState.appState.errorMessage = "Please enter the code from your Email.";
        }
        else{
            try{
                globalState.appState.isLoading = true;
                await Auth.confirmSignUp(globalState.appState.username, globalState.appState.verificationCode);
                globalState.appState.isLoading = false;
                globalState.appState.successMessage = "Your account has been confirmed. You can now sign in.";
            }
            catch(e){
                globalState.appState.errorMessage = e.message;
                globalState.appState.isLoading = false;
                if(e.message.includes("cannot be confirm.")){
                    globalState.appState.errorMessage = "User is already confirmed.";
                }
            }
        }
    }
    
    render(){
        return(
            <ExpansionPanel>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant = "h6">I have an account but need to verify my Email</Typography>
                </ExpansionPanelSummary>

                <ExpansionPanelDetails>
                    <Grid container spacing = {2} direction = "column" justify = "center" alignItems = "center">
                        <Grid item>
                            <TextField
                                onChange = {event => globalState.appState.username = (event.target as HTMLInputElement).value}
                                name = "username"
                                type = "username"
                                margin = "dense"
                                variant = "outlined"
                                label = "Username"
                            >
                            </TextField> 
                        </Grid>

                        <Grid item>
                            <Button 
                                variant = "contained" 
                                color = "default"
                                disabled = {globalState.appState.isLoading}
                                onClick = {() => {
                                    this.handleResend();
                                }}
                            >
                                Resend confirmation code
                            </Button>
                        </Grid>
                        
                        <Grid item>
                            <TextField
                                onChange = {event => globalState.appState.verificationCode = (event.target as HTMLInputElement).value}
                                name = "verificationCode"
                                type = "verificationCode"
                                margin = "dense"
                                variant = "outlined"
                                label = "Verification Code"
                            >
                            </TextField> 
                        </Grid>

                        <Grid item>
                            <Button 
                                variant = "contained" 
                                color = "primary"
                                disabled = {globalState.appState.isLoading}
                                onClick = {() => {
                                    this.handleConfirmation();
                                }}
                            >
                                Verify
                            </Button>
                        </Grid>
                    </Grid>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        )
    }
}
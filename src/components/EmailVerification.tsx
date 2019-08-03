import AppStateStore, { appState } from "../stateStores/appState";
import React from "react";
import { ExpansionPanel, ExpansionPanelSummary, Typography, ExpansionPanelDetails, Grid, Button, TextField } from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Auth } from "aws-amplify";
import { Message } from "primereact/components/message/Message";
import { observer } from "mobx-react";
import winston from "../logging";

@observer
export default class EmailVerification extends React.Component{
    async handleResend(){
        if(appState.username.length === 0){
            appState.emailVerificationErrorMessage = "Please enter a username to resend the confirmation code.";
        }
        else{
            console.log("Resending confirmation code for username: " + appState.username);
            appState.resentCode = true;
            try{
                appState.isLoading = true;
                await Auth.resendSignUp(appState.username);
                appState.isLoading = false;
            }
            catch(e){
                appState.emailVerificationErrorMessage = e.message;
                appState.isLoading = false;
            }
        }   
    }

    async handleConfirmation(){
        if(appState.username.length === 0){
            console.log(appState.emailVerificationErrorMessage.length);
            appState.emailVerificationErrorMessage = "Please enter a username to confirm your account.";
        }
        else if(appState.verificationCode.length === 0){
            appState.emailVerificationErrorMessage = "Please enter the code from your Email.";
        }
        else{
            try{
                appState.isLoading = true;
                await Auth.confirmSignUp(appState.username, appState.verificationCode);
                winston.info("User " + appState.username + " has confirmed their email at " + new Date().toLocaleString("en-US", {timeZone: "America/Denver"}));
                appState.isLoading = false;
            }
            catch(e){
                appState.emailVerificationErrorMessage = e.message;
                appState.isLoading = false;
                if(e.message.includes("cannot be confirm.")){
                    appState.emailVerificationErrorMessage = "User is already confirmed.";
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
                        {appState.emailVerificationErrorMessage.length !== 0 && <Message severity = "error" text = {appState.emailVerificationErrorMessage}/>}
                        <Grid item>
                            <TextField
                                onChange = {event => appState.username = (event.target as HTMLInputElement).value}
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
                                disabled = {appState.isLoading}
                                onClick = {() => {
                                    this.handleResend();
                                }}
                            >
                                Resend confirmation code
                            </Button>
                        </Grid>
                        
                        <Grid item>
                            <TextField
                                onChange = {event => appState.verificationCode = (event.target as HTMLInputElement).value}
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
                                disabled = {appState.isLoading}
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

    componentWillUnmount(){
        appState.emailVerificationErrorMessage = "";
    }
}
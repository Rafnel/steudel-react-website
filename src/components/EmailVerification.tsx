import { Button, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Grid, TextField, Typography } from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { observer, inject } from "mobx-react";
import React from "react";
import UIStateStore from "../configuration/stateStores/uiStateStore";
import UserStateStore from "../configuration/stateStores/userStateStore";
import { AppStateStore } from "../configuration/stateStores/appStateStore";
import { resendConfirmationCode, confirmUserEmail } from "../configuration/cognitoAPI";
import { observable } from "mobx";

export interface EmailVerificationProps{
    uiState?: UIStateStore;
    userState?: UserStateStore;
    appState?: AppStateStore;
}

//updated
@inject("uiState", "userState", "appState")
@observer
export default class EmailVerification extends React.Component<EmailVerificationProps>{
    verificationCode: string = "";
    username: string = "";
    @observable loading: boolean = false;

    get uiState(){
        return this.props.uiState as UIStateStore;
    }

    get userState(){
        return this.props.userState as UserStateStore;
    }

    get appState(){
        return this.props.appState as AppStateStore;
    }
    
    async handleResend(){
        //check that the user entered a username
        if(this.username.length === 0){
            this.uiState.setErrorMessage("Please enter a username to resend the confirmation code.");
        }
        //if they entered a username, attempt to resend email confirmation code.
        else{
            console.log("Resending confirmation code for username: " + this.username);
            this.loading = true;
            let statusObject = await resendConfirmationCode(this.username);

            if(statusObject.status === false){
                //code resend failed.
                this.uiState.setErrorMessage(statusObject.message);
            }
            else{
                //code resend succeeded.
                this.uiState.setSuccessMessage("Resent email confirmation code successfully! Check your inbox.");
            }

            this.loading = false;
        }   
    }

    async handleConfirmation(){
        if(this.username.length === 0){
            this.uiState.setErrorMessage("Please enter a username to confirm your account.");
        }
        else if(this.verificationCode.length === 0){
            this.uiState.setErrorMessage("Please enter the code from your Email.");
        }
        else{
            this.loading = true;
            let statusObject = await confirmUserEmail(this.username, this.verificationCode);

            if(statusObject.status === false){
                //email confirmation failed.
                this.uiState.setErrorMessage(statusObject.message);
            }
            else{
                //email confirmation succeeded.
                this.uiState.setSuccessMessage("Your account has been confirmed. You can now sign in.");
            }
            
            this.loading = false;
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
                                onChange = {event => this.username = (event.target as HTMLInputElement).value}
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
                                disabled = {this.loading}
                                onClick = {() => {
                                    this.handleResend();
                                }}
                            >
                                Resend confirmation code
                            </Button>
                        </Grid>
                        
                        <Grid item>
                            <TextField
                                onChange = {event => this.verificationCode = (event.target as HTMLInputElement).value}
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
                                disabled = {this.loading}
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
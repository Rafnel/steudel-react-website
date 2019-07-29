import AppStateStore from "../stateStores/appState";
import React from "react";
import { ExpansionPanel, ExpansionPanelSummary, Typography, ExpansionPanelDetails, Grid, Button, TextField } from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Auth } from "aws-amplify";
import { Message } from "primereact/components/message/Message";
import { observer } from "mobx-react";
import winston from "../logging";

export interface EmailVerificationProps{
    appState: AppStateStore;
}

@observer
export default class EmailVerification extends React.Component<EmailVerificationProps>{
    async handleResend(){
        if(this.props.appState.username.length === 0){
            this.props.appState.emailVerificationErrorMessage = "Please enter a username to resend the confirmation code.";
        }
        else{
            console.log("Resending confirmation code for username: " + this.props.appState.username);
            this.props.appState.resentCode = true;
            try{
                this.props.appState.isLoading = true;
                await Auth.resendSignUp(this.props.appState.username);
                this.props.appState.isLoading = false;
            }
            catch(e){
                this.props.appState.emailVerificationErrorMessage = e.message;
                this.props.appState.isLoading = false;
            }
        }   
    }

    async handleConfirmation(){
        if(this.props.appState.username.length === 0){
            console.log(this.props.appState.emailVerificationErrorMessage.length);
            this.props.appState.emailVerificationErrorMessage = "Please enter a username to confirm your account.";
        }
        else if(this.props.appState.verificationCode.length === 0){
            this.props.appState.emailVerificationErrorMessage = "Please enter the code from your Email.";
        }
        else{
            try{
                this.props.appState.isLoading = true;
                await Auth.confirmSignUp(this.props.appState.username, this.props.appState.verificationCode);
                winston.info("User " + this.props.appState.username + " has confirmed their email at " + new Date().toLocaleString("en-US", {timeZone: "America/Denver"}));
                this.props.appState.isLoading = false;
            }
            catch(e){
                this.props.appState.emailVerificationErrorMessage = e.message;
                this.props.appState.isLoading = false;
                if(e.message.includes("cannot be confirm.")){
                    this.props.appState.emailVerificationErrorMessage = "User is already confirmed.";
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
                        {this.props.appState.emailVerificationErrorMessage.length !== 0 && <Message severity = "error" text = {this.props.appState.emailVerificationErrorMessage}/>}
                        <Grid item>
                            <TextField
                                onChange = {event => this.props.appState.username = (event.target as HTMLInputElement).value}
                                name = "username"
                                type = "username"
                                margin = "dense"
                                variant = "outlined"
                                label = "UserName"
                            >
                            </TextField> 
                        </Grid>

                        <Grid item>
                            <Button 
                                variant = "contained" 
                                color = "default"
                                disabled = {this.props.appState.isLoading}
                                onClick = {() => {
                                    this.handleResend();
                                }}
                            >
                                Resend confirmation code
                            </Button>
                        </Grid>
                        
                        <Grid item>
                            <TextField
                                onChange = {event => this.props.appState.verificationCode = (event.target as HTMLInputElement).value}
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
                                disabled = {this.props.appState.isLoading}
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
        this.props.appState.emailVerificationErrorMessage = "";
    }
}
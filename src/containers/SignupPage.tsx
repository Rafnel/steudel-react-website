import { Typography, Grid, TextField, Button, CircularProgress, Paper, Snackbar, IconButton } from "@material-ui/core";
import React from "react";
import CloseIcon from '@material-ui/icons/Close';
import { Auth } from "aws-amplify";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Message } from "primereact/components/message/Message";
import AppStateStore from "../stateStores/appState";
import { observer } from "mobx-react";
import winston from "../logging";

export interface SignUpPageProps extends RouteComponentProps<any>{
    appState: AppStateStore;
}

@observer
class SignupPage extends React.Component<SignUpPageProps>{
    password: string = "";
    confirmPassword: string = "";

    validateSignUp(): boolean{
        if(this.props.appState.username.includes(" ")){
            this.props.appState.signUpPageErrorMessage = "Username cannot contain a space.";
            return false;
        }
        if(this.password !== this.confirmPassword){
            this.props.appState.signUpPageErrorMessage = "Passwords must match.";
            return false;
        }
        if(this.password.length < 8){
            this.props.appState.signUpPageErrorMessage = "Password must be 8 characters or greater.";
            return false;
        }
        if(this.props.appState.username.length === 0 || this.props.appState.name.length === 0
           || this.props.appState.email.length === 0){
            this.props.appState.signUpPageErrorMessage = "You left a field blank.";
            return false;
        }

        return true;
    }

    async handleSignUp(){
        try{
            const newUser = await Auth.signUp({
                username: this.props.appState.username,
                password: this.password,
                attributes: {
                    name: this.props.appState.name,
                    email: this.props.appState.email
                }
            });

            this.props.appState.signedUp = true;
            winston.info("User " + this.props.appState.username + " has signed up at " + new Date().toLocaleString("en-US", {timeZone: "America/Denver"}));
        }
        catch(e){
            this.props.appState.signUpPageErrorMessage = e.message;
        }
        this.props.appState.isLoading = false;
    }

    async handleConfirmation(){
        try{
            console.log(":: Authenticating user with email " + this.props.appState.email + " and code " + this.props.appState.verificationCode);

            await Auth.confirmSignUp(this.props.appState.username, this.props.appState.verificationCode);
            await Auth.signIn(this.props.appState.email, this.password);

            this.props.appState.isLoggedIn = true;
            this.props.history.push("/");
            this.props.appState.successMessage = "Account created and logged in successfully.";
            winston.info("User " + this.props.appState.username + " has confirmed their email at " + new Date().toLocaleString("en-US", {timeZone: "America/Denver"}));
        }
        catch(e){
            this.props.appState.signUpPageErrorMessage = e.message;
        }

        this.props.appState.isLoading = false;
    }

    showErrorMessage(){
        if(this.props.appState.signUpPageErrorMessage.length != 0){            
            return <Message severity = "error" text = {this.props.appState.signUpPageErrorMessage}/>
        }
        return null;
    }

    showResendMessage(){
        if(this.props.appState.resentCode){
            return <Snackbar 
                open = {true} 
                autoHideDuration = {8000} 
                color = "primary"
                message = "Resent email confirmation." 
                action = {<IconButton 
                                color="inherit" 
                                key = "close" 
                                aria-label = "close" 
                                onClick = {() => this.props.appState.resentCode = false}
                            > 
                                <CloseIcon/>
                          </IconButton>}
                />
        }
        return null;
    }

    async handleResend(){
        console.log("Resending confirmation code for email: " + this.props.appState.email);
        this.props.appState.resentCode = true;
        await Auth.resendSignUp(this.props.appState.username);
        this.props.appState.isLoading = false;
    }

    renderSignUpForm(){
        return(
            <Grid container spacing = {2} direction = "column" justify = "center" alignItems = "center">
                <Grid item>
                    <Typography variant = "h2"> Rafnel Signup </Typography>
                </Grid>
                <Grid item>
                    <Paper style = {{padding: 10}}>
                        <Typography variant = "body1" component = "p">
                            <b>Username:</b><br/> 
                            Other users can see this on workouts you create.<br/> 
                            You can also sign in with this or your Email.
                        </Typography>
                        <Grid container justify = "center">
                            <TextField
                                style = {{width: "300px"}}
                                onChange = {event => {this.props.appState.username = (event.target as HTMLInputElement).value}}
                                name = "username"
                                type = "username"
                                margin = "dense"
                                onKeyPress = {(event) => {
                                    if(event.key === "Enter"){
                                        if(this.validateSignUp()){
                                            this.props.appState.isLoading = true;
                                            this.handleSignUp();
                                        }
                                    }
                                }}
                                variant = "outlined"
                                label = "UserName"
                                required
                            >
                            </TextField> 
                        </Grid>

                        <Grid container justify = "center">
                            <Typography variant = "caption" display = "block">
                                Spaces not allowed.
                            </Typography>
                        </Grid>

                        <Typography variant = "body1" component = "p">
                            <br/><b>Your name:</b><br/> 
                            You can choose if this is visible.<br/> 
                            Default: not visible to other users.
                        </Typography>

                        <Grid container justify = "center">
                            <TextField
                                onChange = {event => this.props.appState.name = (event.target as HTMLInputElement).value}
                                name = "name"
                                type = "name"
                                onKeyPress = {(event) => {
                                    if(event.key === "Enter"){
                                        if(this.validateSignUp()){
                                            this.props.appState.isLoading = true;
                                            this.handleSignUp();
                                        }
                                    }
                                }}
                                margin = "dense"
                                variant = "outlined"
                                label = "Name"
                                style = {{width: "300px"}}
                                required
                            >
                            </TextField>  
                        </Grid>

                        <Typography variant = "body1" component = "p">
                            <br/><b>Email:</b><br/> 
                            You will be sent a confirmation code.<br/> 
                            Not visible to other users.
                        </Typography>

                        <Grid container justify = "center">
                            <TextField
                                onChange = {event => {this.props.appState.email = (event.target as HTMLInputElement).value}}
                                name = "email"
                                type = "email"
                                onKeyPress = {(event) => {
                                    if(event.key === "Enter"){
                                        if(this.validateSignUp()){
                                            this.props.appState.isLoading = true;
                                            this.handleSignUp();
                                        }
                                    }
                                }}
                                margin = "dense"
                                variant = "outlined"
                                label = "Email"
                                style = {{width: "300px"}}
                                required
                            >
                            </TextField>  
                        </Grid>

                        <Typography variant = "body1" component = "p">
                            <br/><b>Password:</b><br/> 
                        </Typography>

                        <Grid container justify = "center">
                            <TextField
                                onChange = {event => this.password = (event.target as HTMLInputElement).value}
                                name = "password"
                                type = "password"
                                onKeyPress = {(event) => {
                                    if(event.key === "Enter"){
                                        if(this.validateSignUp()){
                                            this.props.appState.isLoading = true;
                                            this.handleSignUp();
                                        }
                                    }
                                }}
                                autoComplete = "current-password"
                                margin = "dense"
                                variant = "outlined"
                                label = "Password"
                                style = {{width: "300px"}}
                                required
                            >
                            </TextField>  
                        </Grid>

                        <Grid container justify = "center">
                            <TextField
                                onChange = {event => this.confirmPassword = (event.target as HTMLInputElement).value}
                                name = "password"
                                type = "password"
                                onKeyPress = {(event) => {
                                    if(event.key === "Enter"){
                                        if(this.validateSignUp()){
                                            this.props.appState.isLoading = true;
                                            this.handleSignUp();
                                        }
                                    }
                                }}
                                autoComplete = "current-password"
                                margin = "dense"
                                variant = "outlined"
                                label = "Confirm Password"
                                style = {{width: "300px"}}
                                required
                            >
                            </TextField>  
                        </Grid>

                        <Grid container justify = "center">
                            <Typography variant = "caption" display = "block">
                                Required: number, capital letter, special character.
                            </Typography>
                        </Grid>

                        <Grid container justify = "center">
                            <Typography variant = "caption" display = "block">
                                Minimum of 8 characters.
                            </Typography>
                        </Grid>
                        
                    </Paper> 
                </Grid>

                <Grid item>
                    <Button 
                        variant = "contained" 
                        disabled = {this.props.appState.isLoading}
                        color = "primary"
                        onClick = {() => {
                            if(this.validateSignUp()){
                                this.props.appState.isLoading = true;
                                this.handleSignUp();
                            }
                        }}
                    >
                        Sign up
                    </Button>
                </Grid>

                <Grid item>
                    {this.props.appState.isLoading && <CircularProgress/>}
                </Grid>

                <Grid item>
                    {this.showErrorMessage()}
                </Grid>
            </Grid>
        )
    }
    renderConfirmation(){
        return(
            <Grid container spacing = {2} direction = "column" justify = "center" alignItems = "center">
                <Grid item>
                    <Typography>
                        Check your Email for the verification code.
                    </Typography>
                </Grid>

                <Grid item>
                    <Button 
                        variant = "contained" 
                        color = "default"
                        disabled = {this.props.appState.isLoading}
                        onClick = {() => {
                            this.props.appState.isLoading = true;
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
                        onKeyPress = {(event) => {
                            if(event.key === "Enter"){
                                this.props.appState.isLoading = true;
                                this.props.appState.signUpPageErrorMessage = "";
                                this.handleConfirmation();
                            }
                        }}
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
                            this.props.appState.isLoading = true;
                            this.props.appState.signUpPageErrorMessage = "";
                            this.handleConfirmation();
                        }}
                    >
                        Verify
                    </Button>
                </Grid>

                <Grid item>
                    {this.showResendMessage()}
                </Grid>

                <Grid item>
                    {this.showErrorMessage()}
                </Grid>

                <Grid item>
                    {this.props.appState.isLoading && <CircularProgress/>}
                </Grid>
            </Grid>
        )
    }
    render(){
        if(this.props.appState.signedUp){
            return this.renderConfirmation();
        }
        else{
            return this.renderSignUpForm();
        }
    }

    componentWillUnmount(){
        this.props.appState.signUpPageErrorMessage = "";
        this.props.appState.signedUp = false;
    }
}

export default withRouter<SignUpPageProps, any>(SignupPage);
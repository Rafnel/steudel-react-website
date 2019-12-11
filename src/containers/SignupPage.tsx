import { Typography, Grid, TextField, Button, CircularProgress, Paper } from "@material-ui/core";
import React from "react";
import { Auth } from "aws-amplify";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { observer, inject } from "mobx-react";
import addUser from "../api/addUser";
import { validatePassword } from "../configuration/loginSignup";
import UIStateStore from "../configuration/stateStores/uiStateStore";
import { AppStateStore } from "../configuration/stateStores/appStateStore";
import UserStateStore from "../configuration/stateStores/userStateStore";
import { confirmSignup, signUserIn } from "../configuration/cognitoAPI";
import { observable } from "mobx";

export interface SignupPageProps{
    uiState?: UIStateStore;
    appState?: AppStateStore;
    userState?: UserStateStore;
}

//updated
@inject("appState", "uiState", "userState")
@observer
class SignupPage extends React.Component<RouteComponentProps<any> & SignupPageProps>{
    password: string = "";
    confirmPassword: string = "";
    username: string = "";
    email: string = "";
    name: string = "";
    verificationCode: string = "";
    @observable resentCode: boolean = false;

    get uiState(){
        return this.props.uiState as UIStateStore;
    }
    
    get appState(){
        return this.props.appState as AppStateStore;
    }
    
    get userState(){
        return this.props.userState as UserStateStore;
    }

    validateSignUp(): boolean{
        if(this.username.includes(" ")){
            this.uiState.errorMessage = "Username cannot contain a space.";
            return false;
        }
        //check that none of the chars are extended ascii
        for(var i = 0; i < this.username.length; i++){
            if(this.username.charCodeAt(i) > 127){
                this.uiState.errorMessage = "Please only include regular characters in your username.";
                return false;
            }
        }
        let validationObj = validatePassword(this.password, this.confirmPassword);

        if(validationObj.status === false){
            this.uiState.errorMessage = validationObj.message;
            return false;
        }
        if(this.username.length === 0 || this.name.length === 0
           || this.email.length === 0){
            this.uiState.errorMessage = "You left a field blank.";
            return false;
        }
        if(this.username.length > 20){
            this.uiState.errorMessage = "Username must be less than 20 characters in length.";
            return false;
        }

        return true;
    }

    async handleSignUp(){
        try{
            await Auth.signUp({
                username: this.username,
                password: this.password,
                attributes: {
                    name: this.name,
                    email: this.email
                }
            });

            this.appState.signedUp = true;
        }
        catch(e){
            this.uiState.errorMessage = e.message;
        }
        this.appState.isLoading = false;
    }

    async handleConfirmation(){
        let confStatus = await confirmSignup(this.username, this.verificationCode);
        if(confStatus.status === false){
            //confirmation failed.
            this.uiState.errorMessage = confStatus.message;
        }
        else{
            //account confirmed successfully. sign the user in and add them to the db.
            let loginStatus = await signUserIn(this.email, this.password);

            if(loginStatus.status === false){
                //sign in didn't work.
                this.uiState.errorMessage = "Account creation was successful, but login failed. Try to log in to your new account from the login page.";
            }
            else{
                //sign in worked. add to db and change state
                this.userState.currentUser = loginStatus.user;

                await addUser(this.userState.currentUser.username);
                this.props.history.push("/");
                this.appState.isLoggedIn = true;
                this.uiState.successMessage = "Account created and logged in successfully.";
            }            
        }

        this.appState.isLoading = false;
    }

    async handleResend(){
        console.log("Resending confirmation code for email: " + this.email);
        this.resentCode = true;
        await Auth.resendSignUp(this.username);
        this.uiState.successMessage = "Resent Email verification code.";
        this.appState.isLoading = false;
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
                                onChange = {event => {this.username = (event.target as HTMLInputElement).value}}
                                name = "username"
                                type = "username"
                                margin = "dense"
                                onKeyPress = {(event) => {
                                    if(event.key === "Enter"){
                                        if(this.validateSignUp()){
                                            this.appState.isLoading = true;
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
                                onChange = {event => this.name = (event.target as HTMLInputElement).value}
                                name = "name"
                                type = "name"
                                onKeyPress = {(event) => {
                                    if(event.key === "Enter"){
                                        if(this.validateSignUp()){
                                            this.appState.isLoading = true;
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
                                onChange = {event => {this.email = (event.target as HTMLInputElement).value}}
                                name = "email"
                                type = "email"
                                onKeyPress = {(event) => {
                                    if(event.key === "Enter"){
                                        if(this.validateSignUp()){
                                            this.appState.isLoading = true;
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
                                            this.appState.isLoading = true;
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
                                            this.appState.isLoading = true;
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
                        disabled = {this.appState.isLoading}
                        color = "primary"
                        onClick = {() => {
                            if(this.validateSignUp()){
                                this.appState.isLoading = true;
                                this.handleSignUp();
                            }
                        }}
                    >
                        Sign up
                    </Button>
                </Grid>

                <Grid item>
                    {this.appState.isLoading && <CircularProgress/>}
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
                        disabled = {this.appState.isLoading}
                        onClick = {() => {
                            this.appState.isLoading = true;
                            this.handleResend();
                        }}
                    >
                        Resend confirmation code
                    </Button>
                </Grid>
                
                <Grid item>
                    <TextField
                        onChange = {event =>this.verificationCode = (event.target as HTMLInputElement).value}
                        name = "verificationCode"
                        type = "verificationCode"
                        margin = "dense"
                        onKeyPress = {(event) => {
                            if(event.key === "Enter"){
                                this.appState.isLoading = true;
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
                        disabled = {this.appState.isLoading}
                        onClick = {() => {
                            this.appState.isLoading = true;
                            this.handleConfirmation();
                        }}
                    >
                        Verify
                    </Button>
                </Grid>

                <Grid item>
                    {this.appState.isLoading && <CircularProgress/>}
                </Grid>
            </Grid>
        )
    }
    render(){
        if(this.appState.signedUp){
            return this.renderConfirmation();
        }
        else{
            return this.renderSignUpForm();
        }
    }

    componentWillUnmount(){
        this.appState.signedUp = false;
    }
}

export default withRouter<RouteComponentProps<any> & SignupPageProps, any>(SignupPage);
import { Typography, Grid, TextField, Button, CircularProgress, Paper } from "@material-ui/core";
import React from "react";
import { Auth } from "aws-amplify";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Message } from "primereact/components/message/Message";
import { observer } from "mobx-react";
import addUser from "../api/addUser";
import getUser from "../api/getUser";
import { globalState } from "../configuration/appState";
import { validatePassword } from "../configuration/loginSignup";

@observer
class SignupPage extends React.Component<RouteComponentProps<any>>{
    password: string = "";
    confirmPassword: string = "";

    validateSignUp(): boolean{
        if(globalState.appState.username.includes(" ")){
            globalState.appState.errorMessage = "Username cannot contain a space.";
            return false;
        }
        if(!validatePassword(this.password, this.confirmPassword)){
            return false;
        }
        if(globalState.appState.username.length === 0 || globalState.appState.name.length === 0
           || globalState.appState.email.length === 0){
            globalState.appState.errorMessage = "You left a field blank.";
            return false;
        }
        if(globalState.appState.username.length > 20){
            globalState.appState.errorMessage = "Username must be less than 20 characters in length.";
            return false;
        }

        return true;
    }

    async handleSignUp(){
        try{
            await Auth.signUp({
                username: globalState.appState.username,
                password: this.password,
                attributes: {
                    name: globalState.appState.name,
                    email: globalState.appState.email
                }
            });

            globalState.appState.signedUp = true;
        }
        catch(e){
            globalState.appState.errorMessage = e.message;
        }
        globalState.appState.isLoading = false;
    }

    async handleConfirmation(){
        try{
            console.log(":: Authenticating user with email " + globalState.appState.email + " and code " + globalState.appState.verificationCode);

            await Auth.confirmSignUp(globalState.appState.username, globalState.appState.verificationCode);
            await Auth.signIn(globalState.appState.email, this.password);
            //add user to the db
            await addUser(globalState.appState.username);
            await getUser(globalState.appState.username);

            globalState.appState.isLoggedIn = true;
            this.props.history.push("/");
            globalState.appState.successMessage = "Account created and logged in successfully.";
        }
        catch(e){
            globalState.appState.errorMessage = e.message;
        }

        globalState.appState.isLoading = false;
    }

    async handleResend(){
        console.log("Resending confirmation code for email: " + globalState.appState.email);
        globalState.appState.resentCode = true;
        await Auth.resendSignUp(globalState.appState.username);
        globalState.appState.successMessage = "Resent Email verification code.";
        globalState.appState.isLoading = false;
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
                                onChange = {event => {globalState.appState.username = (event.target as HTMLInputElement).value}}
                                name = "username"
                                type = "username"
                                margin = "dense"
                                onKeyPress = {(event) => {
                                    if(event.key === "Enter"){
                                        if(this.validateSignUp()){
                                            globalState.appState.isLoading = true;
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
                                onChange = {event => globalState.appState.name = (event.target as HTMLInputElement).value}
                                name = "name"
                                type = "name"
                                onKeyPress = {(event) => {
                                    if(event.key === "Enter"){
                                        if(this.validateSignUp()){
                                            globalState.appState.isLoading = true;
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
                                onChange = {event => {globalState.appState.email = (event.target as HTMLInputElement).value}}
                                name = "email"
                                type = "email"
                                onKeyPress = {(event) => {
                                    if(event.key === "Enter"){
                                        if(this.validateSignUp()){
                                            globalState.appState.isLoading = true;
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
                                            globalState.appState.isLoading = true;
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
                                            globalState.appState.isLoading = true;
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
                        disabled = {globalState.appState.isLoading}
                        color = "primary"
                        onClick = {() => {
                            if(this.validateSignUp()){
                                globalState.appState.isLoading = true;
                                this.handleSignUp();
                            }
                        }}
                    >
                        Sign up
                    </Button>
                </Grid>

                <Grid item>
                    {globalState.appState.isLoading && <CircularProgress/>}
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
                        disabled = {globalState.appState.isLoading}
                        onClick = {() => {
                            globalState.appState.isLoading = true;
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
                        onKeyPress = {(event) => {
                            if(event.key === "Enter"){
                                globalState.appState.isLoading = true;
                                globalState.appState.signUpPageErrorMessage = "";
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
                        disabled = {globalState.appState.isLoading}
                        onClick = {() => {
                            globalState.appState.isLoading = true;
                            globalState.appState.signUpPageErrorMessage = "";
                            this.handleConfirmation();
                        }}
                    >
                        Verify
                    </Button>
                </Grid>

                <Grid item>
                    {globalState.appState.isLoading && <CircularProgress/>}
                </Grid>
            </Grid>
        )
    }
    render(){
        if(globalState.appState.signedUp){
            return this.renderConfirmation();
        }
        else{
            return this.renderSignUpForm();
        }
    }

    componentWillUnmount(){
        globalState.appState.signedUp = false;
    }
}

export default withRouter<RouteComponentProps<any>, any>(SignupPage);
import { Typography, Grid, TextField, Button, CircularProgress, Paper, Snackbar } from "@material-ui/core";
import React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { Auth } from "aws-amplify";
import { mainStore } from "../App";
import { RouteComponentProps } from "react-router-dom";
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { spacing } from '@material-ui/system';

export class SignUpPageStore{
    @observable username: string = "";
    @observable password: string = "";
    @observable confirmPassword: string = "";
    @observable email: string = "";
    @observable name: string = "";
    @observable signedUp: boolean = false;
    @observable verificationCode: string = "";
    @observable isLoading: boolean = false;
    @observable errorMessage: string = "";
}

interface SignUpPageState{
    signUpPageStore: SignUpPageStore;
}

@observer
export class SignupPage extends React.Component<RouteComponentProps, SignUpPageState>{
    constructor(props: RouteComponentProps){
        super(props);

        this.state = {
            signUpPageStore: new SignUpPageStore()
        }
    }

    validateSignUp(): boolean{
        return (
            this.state.signUpPageStore.email.length > 0 &&
            this.state.signUpPageStore.password.length > 0 &&
            this.state.signUpPageStore.name.length > 0 &&
            this.state.signUpPageStore.username.length > 0 &&
            this.state.signUpPageStore.password === this.state.signUpPageStore.confirmPassword
        );
    }

    async handleSignUp(){
        try{
            const newUser = await Auth.signUp({
                username: this.state.signUpPageStore.username,
                password: this.state.signUpPageStore.password,
                attributes: {
                    name: this.state.signUpPageStore.name,
                    email: this.state.signUpPageStore.email
                }
            });

            this.state.signUpPageStore.signedUp = true;
        }
        catch(e){
            alert(e.message);
        }
        this.state.signUpPageStore.isLoading = false;
    }

    async handleConfirmation(){
        try{
            console.log(":: Authenticating user with email " + this.state.signUpPageStore.email + " and code " + this.state.signUpPageStore.verificationCode);

            await Auth.confirmSignUp(this.state.signUpPageStore.username, this.state.signUpPageStore.verificationCode);
            await Auth.signIn(this.state.signUpPageStore.email, this.state.signUpPageStore.password);

            mainStore.isLoggedIn = true;
            this.props.history.push("/");
        }
        catch(e){
            alert(e.message);
            this.state.signUpPageStore.isLoading = false;
        }
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
                                onChange = {event => {this.state.signUpPageStore.username = (event.target as HTMLInputElement).value}}
                                name = "username"
                                type = "username"
                                margin = "dense"
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
                                onChange = {event => this.state.signUpPageStore.name = (event.target as HTMLInputElement).value}
                                name = "name"
                                type = "name"
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
                            You will be sent a confirmation code to this Email.<br/> 
                            Not visible to other users.
                        </Typography>

                        <Grid container justify = "center">
                            <TextField
                                onChange = {event => {this.state.signUpPageStore.email = (event.target as HTMLInputElement).value}}
                                name = "email"
                                type = "email"
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
                                onChange = {event => this.state.signUpPageStore.password = (event.target as HTMLInputElement).value}
                                name = "password"
                                type = "password"
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
                                onChange = {event => this.state.signUpPageStore.confirmPassword = (event.target as HTMLInputElement).value}
                                name = "password"
                                type = "password"
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
                        disabled = {this.state.signUpPageStore.isLoading}
                        color = "primary"
                        onClick = {() => {
                            if(this.validateSignUp()){
                                this.state.signUpPageStore.isLoading = true;
                                this.handleSignUp();
                            }
                        }}
                    >
                        Signup
                    </Button>
                </Grid>

                <Grid item>
                    {() => this.state.signUpPageStore.isLoading ? <CircularProgress/> : null}
                </Grid>

                <Grid item>
                    {() => this.state.signUpPageStore.errorMessage.length !== 0 ? 
                        <Snackbar
                            style = {{backgroundColor: "darkred"}}
                            open = {true}
                            message = {this.state.signUpPageStore.errorMessage}
                            onClose = {() => this.state.signUpPageStore.errorMessage = ""}
                        />
                        : 
                        null}
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
                    <TextField
                        onChange = {event => this.state.signUpPageStore.verificationCode = (event.target as HTMLInputElement).value}
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
                        onClick = {() => {
                            this.state.signUpPageStore.isLoading = true;
                            this.handleConfirmation();
                        }}
                    >
                        Verify
                    </Button>
                </Grid>
            </Grid>
        )
    }
    render(){
        if(this.state.signUpPageStore.signedUp){
            return this.renderConfirmation();
        }
        else{
            return this.renderSignUpForm();
        }
    }
}
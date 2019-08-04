import { Button, CircularProgress, Grid, TextField, Typography } from "@material-ui/core";
import { Auth } from "aws-amplify";
import { observer } from "mobx-react";
import { Message } from "primereact/components/message/Message";
import React from "react";
import { RouteComponentProps, withRouter } from 'react-router-dom';
import addUser from "../api/addUser";
import getUser from "../api/getUser";
import EmailVerification from "../components/EmailVerification";
import ForgotPassword from "../components/ForgotPassword";
import winston from "../logging";
import { globalState } from "../stateStores/appState";

@observer
class LoginPage extends React.Component<RouteComponentProps<any>>{
    password: string = "";
    handleLogin = async (event: any) =>{
        globalState.appState.isLoading = true;
        event.preventDefault();

        if(globalState.appState.email.length === 0){
            globalState.appState.loginPageErrorMessage = "Please enter your Email or username.";
        }
        else if(this.password.length === 0){
            globalState.appState.loginPageErrorMessage = "Please enter a password.";
        }
        else{
            try{
                await Auth.signIn(globalState.appState.email, this.password);
                const currentUserInfo = await Auth.currentUserInfo();

                globalState.appState.username = currentUserInfo.username;
                //check if user is in db, if not, they slipped through cracks and we must add them.
                await getUser(globalState.appState.username);
                console.log(":: User " + globalState.appState.currentUser.username + " logged in with liked components " + globalState.appState.currentUser.liked_components);
                if(globalState.appState.currentUser.username === ""){
                    //user doesn't exist in the db. Add them, then populate our currentUser value.
                    await addUser(globalState.appState.username);
                    await getUser(globalState.appState.username);
                }
                winston.info("User " + globalState.appState.username + " has logged in at " + new Date().toLocaleString("en-US", {timeZone: "America/Denver"}));
                globalState.appState.successMessage = "Successfully logged in. Welcome back " + globalState.appState.username + "!";
                this.props.history.push("/");
                globalState.appState.isLoggedIn = true;
            }
            catch(e){
                globalState.appState.loginPageErrorMessage = e.message;
            }
        }
        globalState.appState.isLoading = false;
    }

    render(){
        return(
            <Grid container spacing = {2} direction = "column" justify = "center" alignItems = "center">
                <Grid item>
                    <Typography variant = "h2">Rafnel Login</Typography>
                </Grid>
                {globalState.appState.loginPageErrorMessage.length !== 0 && <Message severity = "error" text = {globalState.appState.loginPageErrorMessage}/>}
                <Grid container direction = "row" spacing = {1} justify = "center" alignItems = "center">
                    <Grid item>
                        <TextField
                            onChange = {event => {globalState.appState.email = (event.target as HTMLInputElement).value}}
                            name = "email"
                            type = "email"
                            margin = "dense"
                            variant = "outlined"
                            onKeyPress = {(event) => {
                                if(event.key === "Enter"){
                                    this.handleLogin(event);
                                }
                            }}
                            label = "Email / Username"
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
                            onKeyPress = {(event) => {
                                if(event.key === "Enter"){
                                    this.handleLogin(event);
                                }
                            }}
                            label = "Password"
                        >
                        </TextField>  
                    </Grid>
                </Grid>

                <Grid item>
                    <Button 
                        variant = "contained" 
                        color = "primary"
                        onClick = {this.handleLogin}
                        disabled = {globalState.appState.isLoading}
                    >
                        Log in
                    </Button>
                </Grid>

                <Grid item>
                    {globalState.appState.isLoading ? <CircularProgress/> : null}
                </Grid>

                <Grid item>
                    <EmailVerification/>
                </Grid>

                <Grid item>
                    <ForgotPassword/>
                </Grid>

            </Grid>
        )
    }

    componentWillUnmount(){
        globalState.appState.loginPageErrorMessage = "";
    }
}

export default withRouter<RouteComponentProps<any>, any>(LoginPage);
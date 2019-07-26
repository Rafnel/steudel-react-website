import { Typography, Grid, TextField, Button, CircularProgress, Paper } from "@material-ui/core";
import React from "react";
import { observer } from "mobx-react";
import { observable } from "mobx";
import { RouteComponentProps } from 'react-router-dom';
import { Auth } from "aws-amplify";
import { mainStore } from "../App";


export class LoginPageStore{
    @observable email: string = "";
    @observable password: string = "";
    @observable isLoading: boolean = false;
}
interface LoginPageState{
    loginPageStore: LoginPageStore;
}


@observer
export class LoginPage extends React.Component<RouteComponentProps, LoginPageState>{
    constructor(props: RouteComponentProps){
        super(props);

        this.state = {
            loginPageStore: new LoginPageStore()
        }
    }

    handleLogin = async (event: any) =>{
        this.state.loginPageStore.isLoading = true;
        event.preventDefault();

        try{
            await Auth.signIn(this.state.loginPageStore.email, this.state.loginPageStore.password);
            this.state.loginPageStore.isLoading = false;
            alert("Logged in");
            this.props.history.push("/");
            mainStore.isLoggedIn = true;
        }
        catch(e){
            this.state.loginPageStore.isLoading = false;
            alert(e.message);
            
        }
    }

    render(){
        return(
            <Grid container spacing = {2} direction = "column" justify = "center" alignItems = "center">
                <Grid item>
                    <Typography variant = "h2">Rafnel Login</Typography>
                </Grid>

                <Grid container direction = "row" spacing = {1} justify = "center" alignItems = "center">
                    <Grid item>
                        <TextField
                            onChange = {event => {this.state.loginPageStore.email = (event.target as HTMLInputElement).value}}
                            name = "email"
                            type = "email"
                            margin = "dense"
                            variant = "outlined"
                            label = "Email"
                        >
                        </TextField>  
                    </Grid>
                    

                    <Grid item>
                        <TextField
                            onChange = {event => this.state.loginPageStore.password = (event.target as HTMLInputElement).value}
                            name = "password"
                            type = "password"
                            autoComplete = "current-password"
                            margin = "dense"
                            variant = "outlined"
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
                        disabled = {this.state.loginPageStore.isLoading}
                    >
                        Login
                    </Button>
                </Grid>

                <Grid item>
                    {this.state.loginPageStore.isLoading ? <CircularProgress/> : null}
                </Grid>
            </Grid>
        )
    }
}
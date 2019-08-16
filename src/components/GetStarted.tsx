import { RouteComponentProps, withRouter } from "react-router-dom";
import { Paper, Grid, Button, Typography } from "@material-ui/core";
import React from "react";
import WhyCreateAccount from "./WhyCreateAccount";

class GetStarted extends React.Component<RouteComponentProps<any>>{
    render(){
        return(
            <Paper style = {{padding: 10}}>
                <Grid container direction = "row" alignItems = "center" justify = "center" spacing = {2}>
                    <Grid item>
                        <Button
                            variant = "contained"
                            color = "primary"
                            onClick = {() => this.props.history.push("/login")}
                        >
                            Log In
                        </Button>
                    </Grid>

                    <Grid item>
                        <b>or</b>
                    </Grid>

                    <Grid item>
                        <Button
                            variant = "contained"
                            color = "primary"
                            onClick = {() => this.props.history.push("/signup")}
                        >
                            Sign Up
                        </Button>
                    </Grid>
                </Grid>

                &nbsp;

                <Grid container justify = "center" alignItems = "center">
                    Accounts are free, and as of version 0.95 users can:
                </Grid>

                <WhyCreateAccount/>

                <Grid container justify = "center" alignItems = "center">
                    <Button variant = "outlined" color = "primary" onClick = {() => this.props.history.push("/about")}>
                        More Information
                    </Button>
                </Grid>
            </Paper>
        )
    }
}

export default withRouter<RouteComponentProps<any>, any>(GetStarted);
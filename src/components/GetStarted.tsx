import { RouteComponentProps, withRouter } from "react-router-dom";
import { Paper, Grid, Button, Typography } from "@material-ui/core";
import React from "react";

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

                <Grid container direction = "column" alignItems = "center" justify = "center">
                    <Typography variant = "body1">
                        <b>to get started!</b>
                    </Typography>
                </Grid>
            </Paper>
        )
    }
}

export default withRouter<RouteComponentProps<any>, any>(GetStarted);
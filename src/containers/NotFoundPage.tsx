import { CircularProgress, Grid, Link, Typography, Button } from "@material-ui/core";
import { observer, inject } from "mobx-react";
import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import GetStarted from "../components/GetStarted";
import UserStatsHub from "../components/userStats/UserStatsHub";
import { AppStateStore } from "../configuration/stateStores/appStateStore";

export interface NotFoundPageProps{
    appState?: AppStateStore
}

//updated
@inject("appState")
@observer
class NotFoundPage extends React.Component<RouteComponentProps<any> & NotFoundPageProps>{
    get appState(){
        return this.props.appState as AppStateStore;
    }

    render(){
        return(
            <Grid container justify = "center" alignItems = "center" direction = "column" spacing = {2}>
                <Grid item>
                    <Typography variant = "h6">
                        Page not found!
                    </Typography>
                </Grid>

                <Grid item>
                    <Button
                        color = "primary"
                        variant = "contained"
                        onClick = {() => this.props.history.push("/")}
                    >
                        Return Home
                    </Button>
                </Grid>
            </Grid>
        )
    }
}

export default withRouter<RouteComponentProps<any> & NotFoundPageProps, any>(NotFoundPage);
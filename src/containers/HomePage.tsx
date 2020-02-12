import { CircularProgress, Grid, Link, Typography } from "@material-ui/core";
import { observer, inject } from "mobx-react";
import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import GetStarted from "../components/GetStarted";
import UserStatsHub from "../components/userStats/UserStatsHub";
import { AppStateStore } from "../configuration/stateStores/appStateStore";

export interface HomePageProps{
    appState?: AppStateStore
}

//updated
@inject("appState")
@observer
class HomePage extends React.Component<RouteComponentProps<any> & HomePageProps>{
    get appState(){
        return this.props.appState as AppStateStore;
    }

    render(){
        return(
            <Grid container justify = "center" alignItems = "center" direction = "column" spacing = {2}>
                <Grid item>
                    {!this.appState.isLoggedIn && <img src = {process.env.PUBLIC_URL + "/android-chrome-192x192.png"} alt = "logo"/>}

                    <Typography>
                        <Link color = "inherit" href = "https://github.com/Rafnel/steudel-react-website">
                            Version 1.62: 2020-02-12
                        </Link>
                    </Typography>
                </Grid>
                
                {!this.appState.isLoggedIn && 
                 <Grid>
                    <Typography variant = "h5" gutterBottom>
                        <p>Component-Based Workouts</p>
                    </Typography>
                 </Grid>
                }

                {!this.appState.isLoggedIn
                 &&
                 <Grid item>
                     <GetStarted/>
                 </Grid>
                }

                {this.appState.isLoggedIn
                 &&
                 <UserStatsHub/>
                }

                {this.appState.isLoading && <CircularProgress/>}
            </Grid>
        )
    }
}

export default withRouter<RouteComponentProps<any> & HomePageProps, any>(HomePage);
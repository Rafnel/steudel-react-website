import { CircularProgress, Grid, Link, Typography } from "@material-ui/core";
import { observer } from "mobx-react";
import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import GetStarted from "../components/GetStarted";
import UserStatsHub from "../components/userStats/UserStatsHub";
import { globalState } from "../configuration/appState";

@observer
class HomePage extends React.Component<RouteComponentProps<any>>{
    render(){
        return(
            <Grid container justify = "center" alignItems = "center" direction = "column" spacing = {2}>
                <Grid item>
                    <img src = {process.env.PUBLIC_URL + "/android-chrome-192x192.png"} alt = "logo"/>

                    <Typography>
                        <Link color = "inherit" href = "https://github.com/Rafnel/steudel-react-website">
                            Version 1.33: 2019-12-03
                        </Link>
                    </Typography>
                </Grid>
                
                {!globalState.appState.isLoggedIn && 
                 <Grid>
                    <Typography variant = "h5" gutterBottom>
                        <p>Component-Based Workouts</p>
                    </Typography>
                 </Grid>
                }

                {!globalState.appState.isLoggedIn
                 &&
                 <Grid item>
                     <GetStarted/>
                 </Grid>
                }

                {globalState.appState.isLoggedIn
                 &&
                 <UserStatsHub/>
                }

                {globalState.appState.isLoading && <CircularProgress/>}
            </Grid>
        )
    }
}

export default withRouter<RouteComponentProps<any>, any>(HomePage);
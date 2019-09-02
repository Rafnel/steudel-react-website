import { Button, CircularProgress, Grid, Typography, Link, Box } from "@material-ui/core";
import { observer } from "mobx-react";
import React from "react";
import getRandomComponent from "../api/randomComponent";
import SwimComponentCard from "../components/swimcomponents/SwimComponentCard";
import { globalState, SwimComponent } from "../configuration/appState";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { observable } from "mobx";
import GetStarted from "../components/GetStarted";
import WhyCreateAccount from "../components/WhyCreateAccount";

@observer
class HomePage extends React.Component<RouteComponentProps<any>>{
    @observable swimComponent: SwimComponent = {
        username: "",
        set: "",
        component_body: "",
        component_id: "",
        date_created: "",
        intervals: [],
        tags: [],
        yardage: 0,
        difficulty: "",
        likes: 0
    };

    async retrieveSwimComponent(){
        this.swimComponent = await getRandomComponent();
    }

    render(){
        return(
            <Grid container justify = "center" alignItems = "center" direction = "column" spacing = {2}>
                <Grid item>
                    <img src = {process.env.PUBLIC_URL + "/android-chrome-192x192.png"} alt = "logo"/>

                    <Typography>
                        <Link color = "inherit" href = "https://github.com/Rafnel/steudel-react-website">
                            Version 0.97: 2019-09-01
                        </Link>
                    </Typography>
                </Grid>
                
                <Grid>
                    <Typography variant = "h5" gutterBottom>
                        <p>Component-Based Workouts</p>
                    </Typography>
                </Grid>

                {!globalState.appState.isLoggedIn
                 &&
                 <Grid item>
                     <GetStarted/>
                 </Grid>
                }
                
                {globalState.appState.isLoggedIn 
                 &&
                 <Grid item>
                    <Button 
                        color = "primary"
                        variant = "contained" 
                        onClick = {event => {
                            globalState.appState.isLoading = true; 
                            this.retrieveSwimComponent();
                        }}
                    >
                        See a random swim component!
                    </Button>
                 </Grid>
                }

                {globalState.appState.isLoading && <CircularProgress/>}

                {this.swimComponent.username.length !== 0 && globalState.appState.isLoggedIn
                 &&
                 <Grid item>
                     <SwimComponentCard currentComponent = {this.swimComponent} />
                 </Grid>}
            </Grid>
        )
    }
}

export default withRouter<RouteComponentProps<any>, any>(HomePage);
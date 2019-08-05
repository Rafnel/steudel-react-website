import { Button, CircularProgress, Grid, Typography } from "@material-ui/core";
import { observer } from "mobx-react";
import React from "react";
import getRandomComponent from "../api/randomComponent";
import SwimComponentCard from "../components/SwimComponentCard";
import { globalState } from "../stateStores/appState";
import { RouteComponentProps, withRouter } from "react-router-dom";

@observer
class HomePage extends React.Component<RouteComponentProps<any>>{
    
    render(){
        return(
            <Grid container justify = "center" alignItems = "center" direction = "column" spacing = {2}>
                <Grid item>
                    <img src = {process.env.PUBLIC_URL + "/android-chrome-192x192.png"} alt = "logo"/>
                </Grid>
                
                <Grid>
                    <Typography variant = "h5" gutterBottom>
                        <p>Component-Based Workouts</p>
                    </Typography>
                </Grid>

                {globalState.appState.isLoggedIn
                 &&
                 <Grid item>
                     <Button
                        color = "primary"
                        variant = "contained"
                        size = "medium" 
                        onClick = {() => this.props.history.push("/create-swim-component")}
                     >
                        Create your own component!
                     </Button>
                 </Grid>}
                
                {globalState.appState.isLoggedIn 
                 &&
                 <Grid item>
                    <Button 
                        color = "primary"
                        variant = "contained" 
                        onClick = {event => {
                            globalState.appState.isLoading = true;
                            getRandomComponent();                            
                        }}
                    >
                        See a random swim component!
                    </Button>
                 </Grid>
                }

                {globalState.appState.isLoading && <CircularProgress/>}

                {globalState.appState.currentComponent.username.length !== 0 && globalState.appState.isLoggedIn
                 &&
                 <Grid item>
                     <SwimComponentCard/>
                 </Grid>}
            </Grid>
        )
    }
}

export default withRouter<RouteComponentProps<any>, any>(HomePage);
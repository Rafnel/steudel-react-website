import { Typography, Grid, Divider, Button } from "@material-ui/core";
import React, { Fragment } from "react";
import { observer } from "mobx-react";
import { observable } from "mobx";
import { globalState } from "../../configuration/appState";
import getAllWorkoutsFromUser from "../../api/getAllWorkoutsFromUser";
import BeatLoader from 'react-spinners/BeatLoader';
import { PRIMARY } from "../..";
import { RouteComponentProps, withRouter } from "react-router";

@observer
class WorkoutsHub extends React.Component<RouteComponentProps<any>>{
    @observable loadingWorkouts: boolean = true;
    @observable workouts: any[] = [];

    async getWorkouts(){
        this.workouts = await getAllWorkoutsFromUser(globalState.appState.currentUser.username);
        this.loadingWorkouts = false;
    }

    render(){
        return(
            <Fragment>
                <Grid container justify = "center" alignItems = "center" spacing = {2} direction = "column">
                    <Grid item>
                        <Typography variant = "h4">
                            Workouts
                        </Typography>
                    </Grid>

                    {this.loadingWorkouts && <BeatLoader color = {PRIMARY}/>}
                    {!this.loadingWorkouts
                     &&
                     <Grid item>
                         <Typography>
                            Workouts you have created: {this.workouts.length}
                        </Typography>
                     </Grid>
                    }
                </Grid>  

                <Grid item>
                    <Grid container direction = "row" spacing = {1}>
                        <Grid item>
                            <Button
                                color = "primary"
                                style = {{textTransform: "initial"}}
                                variant = "contained"
                                onClick = {() => {
                                    this.props.history.push("/create-swim-workout");
                                }}
                            >
                                Create Workout
                            </Button>
                        </Grid>

                        <Grid item>
                            <Button
                                color = "primary"
                                style = {{textTransform: "initial"}}
                                variant = "contained"
                                onClick = {() => {
                                    this.props.history.push("/my-workouts");
                                }}
                            >
                                View My Workouts
                            </Button>
                        </Grid>
                        
                    </Grid>
                </Grid>

                &nbsp;

                <Divider/>
            </Fragment>
        )
    }

    componentDidMount(){
        this.getWorkouts();
    }
}

export default withRouter<RouteComponentProps<any>, any>(WorkoutsHub);
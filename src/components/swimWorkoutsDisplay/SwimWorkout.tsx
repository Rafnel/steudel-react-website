import React from "react";
import { SwimWorkout } from "../../configuration/appState";
import WorkoutSet from "./WorkoutSet";
import { observer, inject } from "mobx-react";
import { Grid, Button, Paper, Container, Box, Icon, Typography } from "@material-ui/core";
import { RouteComponentProps, withRouter } from "react-router";
import { PDFExport } from '@progress/kendo-react-pdf';
import { observable } from "mobx";
import updateLastUsed from "../../api/updateWorkoutUsedDate";
import { AppStateStore } from "../../configuration/stateStores/appStateStore";
import UserStateStore from "../../configuration/stateStores/userStateStore";
import WorkoutActionsButton from "./WorkoutActionsButton";

export interface SwimWorkoutProps extends RouteComponentProps<any>{
    workout: SwimWorkout;
    appState?: AppStateStore;
    userState?: UserStateStore;
}

export interface WorkoutState{
    workout: any;
    downloadPressed: boolean;
    markingComplete: boolean;
    last_used: string;
}

//updated
@inject("appState", "userState")
@observer
class SwimWorkoutComponent extends React.Component<SwimWorkoutProps>{
    @observable workoutState: WorkoutState = {
        workout: {},
        downloadPressed: false,
        markingComplete: false,
        last_used: this.props.workout.last_used ? this.props.workout.last_used : "----"
    }

    get userState(){
        return this.props.userState as UserStateStore;
    }

    get appState(){
        return this.props.appState as AppStateStore;
    }

    getWorkoutSections(){
        let sections = [];
        if(this.props.workout.warmup.length > 0){
            sections.push(<WorkoutSet key = "Warmup" setName = "Warmup" components = {this.props.workout.warmup}/>);
        }
        if(this.props.workout.preset.length > 0){
            sections.push(<WorkoutSet key = "Pre Set" setName = "Pre Set" components = {this.props.workout.preset}/>);
        }
        if(this.props.workout.mainset.length > 0){
            sections.push(<WorkoutSet key = "Main Set" setName = "Main Set" components = {this.props.workout.mainset}/>);
        }
        if(this.props.workout.cooldown.length > 0){
            sections.push(<WorkoutSet key = "Cooldown" setName = "Cooldown" components = {this.props.workout.cooldown}/>);
        }

        return sections;
    }

    linkButton(){
        return(
            <Button
                style = {{textTransform: "initial"}}
                onClick = {() => this.props.history.push("/workout/" + this.props.workout.username + "/" + this.props.workout.workout_id)}
            >
                <b> {this.props.workout.yardage + " yards"} </b>
            </Button>
        )
    }

    returnWorkout(){
        return(
            <Paper
                style = {{
                    height: 792,
                    width: 612,
                    backgroundColor: "white",
                    margin: 0,
                    padding: 0,
                    overflowY: "auto",
                    position: "relative"
                }}
            >
                <div style = {{padding: 50}}>
                    {this.getWorkoutSections()}
                </div>
                

                <div style = {{position: "absolute", bottom: 50, right: 50}}>
                    {this.linkButton()} 
                </div>

                {!this.workoutState.downloadPressed && 
                    <div style = {{position: "absolute", bottom: 0, left: 0}}>
                        <WorkoutActionsButton workout = {this.props.workout} workoutState = {this.workoutState}/>
                    </div>
                }

                {!this.workoutState.downloadPressed && this.props.workout.username === this.userState.currentUser.username && 
                    <Typography variant = "caption" style = {{position: "absolute", bottom: 10, right: 10}}>
                        &nbsp; Last used: {this.workoutState.last_used}
                    </Typography>
                }
            </Paper>
        )
    }

    render(){
        return(
            <PDFExport 
                paperSize = {"Letter"}
                fileName = {"workout-" + this.props.workout.username + "-" + this.props.workout.workout_id}
                title = ""
                subject = ""
                keywords = ""
                ref = {(r) => this.workoutState.workout = r}
            >
                {this.returnWorkout()}
            </PDFExport>
        )
    }
}

export default withRouter<SwimWorkoutProps, any>(SwimWorkoutComponent);
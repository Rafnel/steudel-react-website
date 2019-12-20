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

export interface SwimWorkoutProps extends RouteComponentProps<any>{
    workout: SwimWorkout;
    appState?: AppStateStore;
    userState?: UserStateStore;
}

//updated
@inject("appState", "userState")
@observer
class SwimWorkoutComponent extends React.Component<SwimWorkoutProps>{
    workout: any;
    //this state variable will be used to hide the download button in the downloaded pdf.
    @observable downloadPressed: boolean = false;
    @observable markingComplete: boolean = false;
    @observable last_used: string = this.props.workout.last_used ? this.props.workout.last_used : "----";

    get userState(){
        return this.props.userState as UserStateStore;
    }

    get appState(){
        return this.props.appState as AppStateStore;
    }

    //downloads the workout to user's device
    exportWorkoutPDF = () => {
        this.downloadPressed = true;
        setTimeout(() => {
            this.workout.save();
            this.downloadPressed = false;
        }, 50)
    }

    markWorkoutUsed = async () => {
        this.markingComplete = true;
        await updateLastUsed(this.props.workout.workout_id, this.userState.currentUser.username);
        this.last_used = new Date().toLocaleString("en-US", {timeZone: "America/Chicago"}).toString();
        this.markingComplete = false;
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

    exportButton(){
        return(
            <div>
                <Button
                    onClick = {() => this.exportWorkoutPDF()}
                    style = {{textTransform: "initial", display: "inline-block"}}
                >
                    Download
                </Button>

                {this.props.workout.username === this.userState.currentUser.username && 
                    <Button
                        onClick = {() => this.markWorkoutUsed()}
                        disabled = {this.markingComplete}
                        style = {{textTransform: "initial", display: "inline-block"}}
                    >
                        Mark as Used
                    </Button>
                }
            </div>
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

                {!this.downloadPressed && 
                    <div style = {{position: "absolute", bottom: 0, left: 0}}>
                        {this.exportButton()} 
                    </div>
                }

                {!this.downloadPressed && this.props.workout.username === this.userState.currentUser.username && 
                    <Typography variant = "caption" style = {{position: "absolute", bottom: 10, right: 10}}>
                        &nbsp; Last used: {this.last_used}
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
                ref = {(r) => this.workout = r}
            >
                {this.returnWorkout()}
            </PDFExport>
        )
    }
}

export default withRouter<SwimWorkoutProps, any>(SwimWorkoutComponent);
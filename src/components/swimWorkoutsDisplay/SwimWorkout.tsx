import React from "react";
import { SwimWorkout } from "../../configuration/appState";
import WorkoutSet from "./WorkoutSet";
import { observer } from "mobx-react";
import { Grid, Button, Paper, Container, Box, Icon } from "@material-ui/core";
import { RouteComponentProps, withRouter } from "react-router";
import { PDFExport } from '@progress/kendo-react-pdf';
import { observable } from "mobx";

export interface SwimWorkoutProps extends RouteComponentProps<any>{
    workout: SwimWorkout;
}

//updated
@observer
class SwimWorkoutComponent extends React.Component<SwimWorkoutProps>{
    workout: any;
    //this state variable will be used to hide the download button in the downloaded pdf.
    @observable downloadPressed: boolean = false;

    //downloads the workout to user's device
    exportWorkoutPDF = () => {
        this.downloadPressed = true;
        setTimeout(() => {
            this.workout.save();
            this.downloadPressed = false;
        }, 50)
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
            <Button
                onClick = {() => this.exportWorkoutPDF()}
                style = {{textTransform: "initial"}}
            >
                Download
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

                {!this.downloadPressed && 
                    <div style = {{position: "absolute", bottom: 50, left: 50}}>
                        {this.exportButton()} 
                    </div>
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
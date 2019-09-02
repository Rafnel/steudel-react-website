import React from "react";
import { Grid, CircularProgress, Button, Icon } from "@material-ui/core";
import { observer } from "mobx-react";
import { observable } from "mobx";
import { SwimWorkout, globalState } from "../configuration/appState";
import getWorkoutByID from "../api/getWorkoutByID";
import SwimWorkoutComponent from "../components/swimWorkoutsDisplay/SwimWorkout";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { css } from "@material-ui/system";

export interface SingleWorkoutPageProps{
    username: string;
    workoutID: string;
}

@observer
export default class SingleWorkoutPage extends React.Component<SingleWorkoutPageProps>{
    @observable workout: SwimWorkout = new SwimWorkout();
    async getWorkout(){
        globalState.appState.isLoading = true;
        this.workout = await getWorkoutByID(this.props.username, this.props.workoutID);
        globalState.appState.isLoading = false;
    }

    exportWorkoutPDF(){
        //first, convert the svg to png
        const input = document.getElementById("workout") as HTMLElement;

        html2canvas(input).then(canvas => {
            const imgData = canvas.toDataURL("image/jpeg");

            //second, convert the png to pdf using jsPDF library.
            const pdf = new jsPDF();
            pdf.addImage(imgData, "JPEG", 0, 0);
            pdf.save("workout.pdf");
        });
    }

    render(){
        return(
            <Grid container justify = "center" alignItems = "center" direction = "column" spacing = {2}>
                <Grid item>
                    {globalState.appState.isLoading && <CircularProgress/>}
                    {!globalState.appState.isLoading && <SwimWorkoutComponent workout = {this.workout}/>}
                </Grid>

                <Grid item>
                    <Button
                        onClick = {() => this.exportWorkoutPDF()}
                        color = "primary"
                        variant = "contained"
                    >
                        <Icon>get_app</Icon>
                        &nbsp;
                        Export workout as PDF
                    </Button>
                </Grid>
            </Grid>
        )
    }

    componentDidMount(){
        this.getWorkout();
    }
}
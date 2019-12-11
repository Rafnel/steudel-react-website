import React from "react";
import { Grid, CircularProgress, Button, Icon } from "@material-ui/core";
import { observer, inject } from "mobx-react";
import { observable } from "mobx";
import { SwimWorkout } from "../configuration/appState";
import getWorkoutByID from "../api/getWorkoutByID";
import SwimWorkoutComponent from "../components/swimWorkoutsDisplay/SwimWorkout";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { AppStateStore } from "../configuration/stateStores/appStateStore";

export interface SingleWorkoutPageProps{
    username: string;
    workoutID: string;
    appState?: AppStateStore;
}

//updated
@inject("appState")
@observer
export default class SingleWorkoutPage extends React.Component<SingleWorkoutPageProps>{
    @observable workout: SwimWorkout = new SwimWorkout();
    async getWorkout(){
        this.appState.isLoading = true;
        this.workout = await getWorkoutByID(this.props.username, this.props.workoutID);
        this.appState.isLoading = false;
    }

    get appState(){
        return this.props.appState as AppStateStore;
    }

    exportWorkoutPDF(){
        //first, convert the svg to png
        const input = document.getElementById("workout") as HTMLElement;

        html2canvas(input).then(canvas => {
            const imgData = canvas.toDataURL("image/png");

            //second, convert the png to pdf using jsPDF library.
            const pdf = new jsPDF();
            pdf.addImage(imgData, "PNG", 2, 2);
            pdf.save("workout.pdf");
        });
    }

    render(){
        return(
            <Grid container justify = "center" alignItems = "center" direction = "column" spacing = {2}>
                <Grid item>
                    {this.appState.isLoading && <CircularProgress/>}
                    {!this.appState.isLoading && <SwimWorkoutComponent workout = {this.workout}/>}
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
import React from "react";
import { Grid, Typography, Paper } from "@material-ui/core";
import WorkoutSection from "../components/WorkoutSection";
import { observable } from "mobx";
import { SwimComponent } from "../stateStores/appState";
import { observer } from "mobx-react";

export class SwimWorkoutPageStore{
    //the list of swim components used by child components on this page
    swimComponents: SwimComponent[] = observable([]);

    //this is used to indicate to the swim component rows which index of the array that
    //their swim component exists every time we push a new item on to the array.
    @observable nextIndex: number = 0;
}

@observer
export default class CreateSwimWorkoutPage extends React.Component{
    store: SwimWorkoutPageStore = new SwimWorkoutPageStore();

    createWorkoutSections(){
        return(
            <Grid container alignItems = "center" justify = "center" spacing  = {2} direction = "column">
                <Grid item>
                    <WorkoutSection sectionTitle = "Warmup" initialComponentCount = {1} pageStore = {this.store}/>
                </Grid>

                <Grid item>
                    <WorkoutSection sectionTitle = "Pre Set" initialComponentCount = {2} pageStore = {this.store}/>
                </Grid>

                <Grid item>
                    <WorkoutSection sectionTitle = "Main Set" initialComponentCount = {4} pageStore = {this.store}/>
                </Grid>

                <Grid item>
                    <WorkoutSection sectionTitle = "Cooldown" initialComponentCount = {1} pageStore = {this.store}/>
                </Grid>
            </Grid>
        )
    }

    render(){
        return(
            <Grid container alignItems = "center" justify = "center" spacing  = {2} direction = "column">
                <Grid item>
                    <Typography variant = "h3">
                        Create a Swim Workout
                    </Typography>
                </Grid>

                <Grid item>
                    <Typography variant = "body1">
                        Each workout you author will be made up of components
                        created on this page.
                    </Typography>

                    <Typography variant = "body1">
                        Those components will also be saved separately
                        so that users can explore them!
                    </Typography>
                </Grid>

                <Grid item>
                    <Paper style = {{padding: 10}}>
                        {this.createWorkoutSections()}
                    </Paper>
                </Grid>
            </Grid>
        )
    }
}
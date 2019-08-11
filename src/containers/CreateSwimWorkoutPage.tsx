import React from "react";
import { Grid, Typography, Paper, Button, Divider, FormControl, InputLabel, Select, OutlinedInput, MenuItem, CircularProgress } from "@material-ui/core";
import WorkoutSection from "../components/WorkoutSection";
import { observable } from "mobx";
import { SwimComponent, globalState, SwimWorkout } from "../stateStores/appState";
import { observer } from "mobx-react";
import SaveIcon from '@material-ui/icons/Save';
import createSwimComponent from "../api/createSwimComponent";
import createSwimWorkout from "../api/createSwimWorkout";


export class SwimWorkoutPageStore{
    //the list of swim components used by child components on this page
    swimComponents: SwimComponent[] = observable([]);

    //this is used to indicate to the swim component rows which index of the array that
    //their swim component exists every time we push a new item on to the array.
    @observable nextIndex: number = 0;

    //total workout yardage, listed on the page
    @observable workoutYardage: number = 0;

    //difficulty specified by the user of the workout.
    @observable difficulty: string = "";

    @observable noSaving: boolean = false;
}

@observer
export default class CreateSwimWorkoutPage extends React.Component{
    constructor(props: any){
        super(props);

        this.handleWorkoutSave = this.handleWorkoutSave.bind(this);
    }
    store: SwimWorkoutPageStore = new SwimWorkoutPageStore();

    validateComponent(component: SwimComponent): boolean{
        if(isNaN(Number(component.yardage))){
            globalState.appState.errorMessage = "Yardage for your components must be a numeric value only.";
            return false;
        }
        
        return true;
    }

    validateWorkout(): boolean{
        if(this.store.difficulty.length === 0){
            globalState.appState.errorMessage = "Please enter a difficulty for the workout.";
            return false;
        }
        else if(this.store.workoutYardage === 0){
            globalState.appState.errorMessage = "Your workout can not have 0 yardage.";
            return false;
        }

        return true;
    }

    //function will save each component making up the workout on this page, then finally save the workout as a list of 
    //username,component_id strings for each component in a certain set.
    async handleWorkoutSave(){
        globalState.appState.isLoading = true;
        //first, filter out any components that have an empty body.
        let componentsToSave: SwimComponent[] = this.store.swimComponents.filter((component) =>{
            return component.component_body.length > 0;
        });

        //if the components to save is empty, return an error to user.
        if(componentsToSave.length === 0){
            globalState.appState.errorMessage = "Please enter some components for your workout before submitting.";
            globalState.appState.isLoading = false;
            return;
        }

        //next, save each component and attain a list of username,component_id's
        let componentIDs: string[] = [];
        for(var i = 0; i < componentsToSave.length; i++){
            componentsToSave[i].difficulty = this.store.difficulty;
            //filter out empty intervals
            componentsToSave[i].intervals = componentsToSave[i].intervals.filter((interval) => {
                return interval.length > 0;
            })

            //validate the component
            if(!this.validateComponent(componentsToSave[i])){
                return;
            }

            //save the component
            let comp: SwimComponent = await createSwimComponent(componentsToSave[i]);
            //add it to the list for the workout.
            componentIDs.push(comp.username + "," + comp.component_id);
        }

        //construct the workout
        let workout: SwimWorkout = new SwimWorkout();
        workout.username = globalState.appState.currentUser.username;
        workout.yardage = this.store.workoutYardage;
        workout.difficulty = this.store.difficulty;
        //get the components in the correct set.
        for(var i = 0; i < componentsToSave.length; i++){
            if(componentsToSave[i].set === "Warmup"){
                workout.warmup.push(componentIDs[i]);
            }
            else if(componentsToSave[i].set === "Pre Set"){
                workout.preset.push(componentIDs[i]);
            }
            else if(componentsToSave[i].set === "Main Set"){
                workout.mainset.push(componentIDs[i]);
            }
            else if(componentsToSave[i].set === "Cooldown"){
                workout.cooldown.push(componentIDs[i]);
            }
        }

        //finally, add the swim workout to the database.
        createSwimWorkout(workout);

        globalState.appState.isLoading = false;
    }

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
                        <Grid item>
                            <FormControl variant = "outlined" style = {{minWidth: 200}}>
                                <InputLabel margin = "dense">Workout Difficulty</InputLabel>
                                <Select
                                    margin = "dense"
                                    value = {this.store.difficulty}
                                    required
                                    onChange = {event => {this.store.difficulty = event.target.value as string}}
                                    input = {<OutlinedInput labelWidth = {200} name="Workout Difficulty" />}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value="beginner">Beginner</MenuItem>
                                    <MenuItem value="intermediate">Intermediate</MenuItem>
                                    <MenuItem value="advanced">Advanced</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {this.createWorkoutSections()}

                        <Divider/>

                        &nbsp;

                        <Grid container justify = "flex-end" alignItems = "flex-end" spacing  = {2} direction = "row">
                            <Grid item>
                                <Typography variant = "body2">
                                    <b>Total Workout Yardage: {this.store.workoutYardage}</b>
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                {globalState.appState.isLoading && <CircularProgress/>}

                <Grid item>
                    <Button
                        variant = "contained"
                        size = "medium"
                        disabled = {globalState.appState.isLoading || this.store.noSaving}
                        color = "primary"
                        onClick = {() => {
                            if(this.validateWorkout()){
                                this.handleWorkoutSave();
                            }
                        }}
                    >
                        <SaveIcon/>
                        &nbsp;
                        Save
                    </Button>
                </Grid>
            </Grid>
        )
    }
}
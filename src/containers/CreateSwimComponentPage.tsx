import React from "react";
import { Grid, Paper, Typography, TextField, Select, OutlinedInput, FormControl, InputLabel, MenuItem, FormHelperText, Button, CircularProgress } from "@material-ui/core";
import SaveIcon from '@material-ui/icons/Save';
import { observer } from "mobx-react";
import { observable } from "mobx";
import { globalState, SwimComponent } from "../configuration/appState";
import createSwimComponent from "../api/createSwimComponent";
import IntervalsList from "../components/intervals/IntervalsList";

export class CreateSwimComponentStore{
    @observable intervals: string[] = [];
}

@observer
export default class CreateSwimComponentPage extends React.Component{
    componentBody: string = "";
    yardage: string = "";
    @observable difficulty: string = "";
    @observable set: string = "";
    tags: string = "";
    @observable store: CreateSwimComponentStore = new CreateSwimComponentStore();

    validateComponent(): boolean{
        if(isNaN(Number(this.yardage))){
            globalState.appState.errorMessage = "Yardage must be a numeric value only.";
            return false;
        }
        if(this.tags.includes(" ")){
            globalState.appState.errorMessage = "Tags can not contain a space.";
            return false;
        }
        if(this.componentBody.length === 0 || this.yardage.length === 0 || this.difficulty.length === 0 || this.set.length === 0){
            globalState.appState.errorMessage = "Required fields can not be empty.";
            return false;
        }
        return true;
    }

    generateTagsFromBody(componentBody: string): string[]{
        let tags: string[] = componentBody.split(" ");
        return tags;
    }

    async saveComponent(){
        globalState.appState.isLoading = true;
        //only add intervals that have content.
        console.log("intervals list length: " + this.store.intervals.length);
        let intervalsToAdd: string[] = [];
        for(var i = 0; i < this.store.intervals.length; i++){
            console.log("Interval " + i + " is " + this.store.intervals[i]);
            if(this.store.intervals[i].length > 0){
                console.log("adding interval " + this.store.intervals[i]);
                intervalsToAdd.push(this.store.intervals[i]);
            }
        }

        let tagsList: string[] = [];
        if(this.tags.length > 0){
            tagsList = this.tags.split(",");
        }

        //append tags based off each word in the user's component
        tagsList.push(...this.generateTagsFromBody(this.componentBody));

        let swimComponent: SwimComponent = {
            username: globalState.appState.currentUser.username,
            yardage: +this.yardage,
            set: this.set,
            difficulty: this.difficulty,
            component_body: this.componentBody,
            component_id: "",
            date_created: "",
            intervals: intervalsToAdd,
            tags: tagsList,
            likes: 0
        };

        try{
            await createSwimComponent(swimComponent);
            globalState.appState.successMessage = "Your component has been created successfully.";
        }
        catch(e){
            globalState.appState.errorMessage = e + " " + e.message;
        }

        globalState.appState.isLoading = false;
    }

    render(){
        return(
            <Grid spacing = {3} container justify = "center" direction = "column" alignItems = "center">
                <Grid item>
                    <Paper style = {{maxWidth: 900, padding: 10}}>
                        <Grid container justify = "center">
                            <Typography variant = "h3">
                                Create a Swim Component
                            </Typography>
                        </Grid>
                        &nbsp;&nbsp;&nbsp;
                        <Typography component = "p">
                            Create your own swim components on this page. Users will be able
                            to browse your components and like them. 
                        </Typography>
                    </Paper>
                </Grid>

                <Grid item>
                    <Paper style = {{maxWidth: 900, padding: 10}}>
                        <Grid spacing = {2} container alignItems = "center" justify = "center" direction = "column">
                            <Grid item>
                                <TextField
                                    style = {{minWidth: 250}}
                                    multiline
                                    required
                                    variant = "outlined"
                                    label = "Component Body"
                                    placeholder = "Example: 4 x 100 freestyle swim, focus on turns"
                                    margin = "dense"
                                    onChange = {event => {this.componentBody = (event.target as HTMLInputElement).value}}
                                />
                            </Grid>

                            <Grid item>
                                <Typography>
                                    Optional: Intervals (Fastest -> Slowest):
                                </Typography>
                            </Grid>

                            <Grid item>
                                <IntervalsList store = {this.store} initialSize = {5}/>
                            </Grid>

                            <Grid item>
                                <FormControl variant = "outlined" margin = "dense">
                                    <TextField
                                        variant = "outlined"
                                        required
                                        label = "Total Yardage"
                                        margin = "dense"
                                        onChange = {event => {this.yardage = (event.target as HTMLInputElement).value}}
                                    />
                                    <FormHelperText margin = "dense">This field must be numeric only.</FormHelperText>
                                </FormControl>                 
                            </Grid>
                            

                            <Grid item>
                                <Grid spacing = {1} alignItems = "center" justify = "center" container direction = "row">
                                    <Grid item>
                                        <FormControl variant = "outlined" style = {{minWidth: 150}}>
                                            <InputLabel margin = "dense">Difficulty</InputLabel>
                                            <Select
                                                margin = "dense"
                                                value = {this.difficulty}
                                                required
                                                onChange = {event => {this.difficulty = event.target.value as string}}
                                                input = {<OutlinedInput labelWidth = {150} name="Difficulty" />}
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

                                    <Grid item>
                                        <FormControl variant = "outlined" style = {{minWidth: 150}}>
                                            <InputLabel margin = "dense">Set</InputLabel>
                                            <Select
                                                value = {this.set}
                                                required
                                                margin = "dense"
                                                onChange = {event => {this.set = event.target.value as string}}
                                                input = {<OutlinedInput labelWidth = {150} name="Set" />}
                                            >
                                                <MenuItem value="">
                                                    <em>None</em>
                                                </MenuItem>
                                                <MenuItem value="Warmup">Warmup</MenuItem>
                                                <MenuItem value="Pre Set">Pre Set</MenuItem>
                                                <MenuItem value="Main Set">Main Set</MenuItem>
                                                <MenuItem value="Cooldown">Cooldown</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item>
                                <FormControl variant = "outlined" margin = "dense">
                                    <TextField
                                        variant = "outlined"
                                        label = "OPTIONAL - Tags"
                                        margin = "dense"
                                        onChange = {event => {this.tags = (event.target as HTMLInputElement).value}}
                                        placeholder = "Example: freestyle,swim,walls,turns"
                                    />
                                    <FormHelperText margin = "dense">
                                        Use this field if you want to apply tags to your component to help others find it. 
                                    </FormHelperText>
                                    <FormHelperText margin = "dense">
                                        No spaces allowed, each tag must be comma-separated.
                                    </FormHelperText>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                <Grid item>
                    <Button
                        variant = "contained"
                        size = "medium"
                        disabled = {globalState.appState.isLoading}
                        color = "primary"
                        onClick = {() => {
                            if(this.validateComponent()){
                                this.saveComponent()
                            }
                        }}
                    >
                        <SaveIcon/>
                        &nbsp;
                        Save
                    </Button>
                </Grid>

                {globalState.appState.isLoading && <CircularProgress/>}
            </Grid>
        )
    }
}
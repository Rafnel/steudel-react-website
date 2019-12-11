import React from "react";
import { Grid, TextField, Tooltip } from "@material-ui/core";
import { SwimWorkoutPageStore } from "../../containers/CreateSwimWorkoutPage";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { CreateSwimComponentStore } from "../../containers/CreateSwimComponentPage";
import IntervalsList from "../intervals/IntervalsList";

export interface WorkoutSwimComponentProps{
    store: SwimWorkoutPageStore;
    indexOfComponentsArray: number;
}

//updated
@observer
export default class WorkoutSwimComponent extends React.Component<WorkoutSwimComponentProps>{
    @observable yardageError: string = "";
    yardage: number = 0;
    @observable intervalsStore: CreateSwimComponentStore = new CreateSwimComponentStore();
    
    constructor(props: WorkoutSwimComponentProps){
        super(props);

        //give the intervals store the reference to the swim component's intervals list.
        this.intervalsStore.intervals = this.props.store.swimComponents[this.props.indexOfComponentsArray].intervals;

        this.handleComponentBodyChange = this.handleComponentBodyChange.bind(this);
        this.handleYardageChange = this.handleYardageChange.bind(this);
    }

    handleComponentBodyChange(event: any){
        this.props.store.swimComponents[this.props.indexOfComponentsArray].component_body = (event.target as HTMLInputElement).value;;
    }

    handleYardageChange(event: any){
        if(isNaN(Number((event.target as HTMLInputElement).value))){
            this.yardageError = "Must be numeric.";
            this.props.store.noSaving = true;
        }
        else if((event.target as HTMLInputElement).value.length > 0){
            let ydg: number = +(event.target as HTMLInputElement).value;

            this.yardageError = "";

            this.props.store.workoutYardage -= this.yardage;
            this.yardage = ydg;
            this.props.store.swimComponents[this.props.indexOfComponentsArray].yardage = ydg;
            this.props.store.workoutYardage += this.yardage;

            this.props.store.noSaving = false;
        }
        else{
            //the user removed the text from the field.
            this.props.store.workoutYardage -= this.yardage;
            this.yardageError = "";
            this.yardage = 0;

            this.props.store.noSaving = false;
        }
    }

    render(){
        console.log(":: rendering workout swim component with index " + this.props.indexOfComponentsArray);
        return(
            <Grid spacing = {1} container direction = "row" alignItems = "center" justify = "center">
                <Grid item>
                    {this.props.indexOfComponentsArray + 1 + ":"}
                </Grid>

                <Grid item>
                    <TextField
                        style = {{minWidth: 250}}
                        multiline
                        variant = "outlined"
                        label = "Component Body"
                        placeholder = "Example: 4 x 100 freestyle swim, focus on turns"
                        margin = "dense"
                        onChange = {this.handleComponentBodyChange}
                    />
                </Grid>

                <Grid item>
                    <IntervalsList store = {this.intervalsStore} initialSize = {5}/>
                </Grid>

                <Grid item>
                    <Tooltip title = "Yardage of this component. Must be numeric.">
                        <TextField
                            style = {{maxWidth: 125}}
                            variant = "outlined"
                            label = "Total Yardage"
                            margin = "dense"
                            helperText = {this.yardageError}
                            error = {this.yardageError !== ""}
                            onChange = {this.handleYardageChange}
                        />
                    </Tooltip>                
                </Grid>
                
            </Grid>
        )
    }
}
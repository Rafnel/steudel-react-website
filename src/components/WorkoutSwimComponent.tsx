import React from "react";
import { Grid, TextField, Tooltip } from "@material-ui/core";
import { SwimWorkoutPageStore } from "../containers/CreateSwimWorkoutPage";
import { observable } from "mobx";
import { observer } from "mobx-react";

export interface WorkoutSwimComponentProps{
    store: SwimWorkoutPageStore;
    indexOfComponentsArray: number;
}

@observer
export default class WorkoutSwimComponent extends React.Component<WorkoutSwimComponentProps>{
    @observable yardageError: string = "";
    constructor(props: WorkoutSwimComponentProps){
        super(props);

        this.handleComponentBodyChange = this.handleComponentBodyChange.bind(this);
        this.handleYardageChange = this.handleYardageChange.bind(this);
    }

    handleComponentBodyChange(event: any){
        this.props.store.swimComponents[this.props.indexOfComponentsArray].component_body = (event.target as HTMLInputElement).value;;
    }

    handleYardageChange(event: any){
        if(isNaN(Number((event.target as HTMLInputElement).value))){
            this.yardageError = "Must be numeric.";
        }
        else if((event.target as HTMLInputElement).value.length > 0){
            this.yardageError = "";
            this.props.store.swimComponents[this.props.indexOfComponentsArray].yardage = +(event.target as HTMLInputElement).value;
        }
        else{
            //the user removed the text from the field.
            this.yardageError = "";
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
                    <TextField
                        variant = "outlined"
                        label = "Interval 1"
                        style = {{maxWidth: 100}}
                        margin = "dense"
                        onChange = {event => {
                            this.props.store.swimComponents[this.props.indexOfComponentsArray].intervals[0] = (event.target as HTMLInputElement).value;
                        }}
                    />
                </Grid>

                <Grid item>
                    /
                </Grid>

                <Grid item>
                    <TextField
                        variant = "outlined"
                        label = "Interval 2"
                        style = {{maxWidth: 100}}
                        margin = "dense"
                        onChange = {event => {
                            this.props.store.swimComponents[this.props.indexOfComponentsArray].intervals[1] = (event.target as HTMLInputElement).value;
                        }}
                    />
                </Grid>

                <Grid item>
                    /
                </Grid>

                <Grid item>
                    <TextField
                        variant = "outlined"
                        label = "Interval 3"
                        style = {{maxWidth: 100}}
                        margin = "dense"
                        onChange = {event => {
                            this.props.store.swimComponents[this.props.indexOfComponentsArray].intervals[2] = (event.target as HTMLInputElement).value;
                        }}
                    />
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
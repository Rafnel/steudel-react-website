import React from "react";
import { TextField } from "@material-ui/core";
import { CreateSwimComponentStore } from "../../containers/CreateSwimComponentPage";

export interface IntervalFieldProps{
    store: CreateSwimComponentStore;
    intervalIndex: number;
}

//updated
export default class IntervalField extends React.Component<IntervalFieldProps>{
    label: string = "Interval " + (this.props.intervalIndex + 1);

    render(){
        const index: number = this.props.intervalIndex;

        return(
            <TextField
                variant = "outlined"
                label = {this.label}
                style = {{maxWidth: 100}}
                margin = "dense"
                onChange = {event => {this.props.store.intervals[index] = (event.target as HTMLInputElement).value}}
            />
        )
    }
}
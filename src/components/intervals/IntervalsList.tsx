import React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { Grid, Tooltip, IconButton, Icon } from "@material-ui/core";
import IntervalField from "./IntervalField";
import { CreateSwimComponentStore } from "../../containers/CreateSwimComponentPage";

export interface IntervalsListProps{
    store: CreateSwimComponentStore;
    initialSize: number;
}

//updated
@observer
export default class IntervalsList extends React.Component<IntervalsListProps>{
    @observable intervalComponents: any[] = [];
    @observable numIntervals: number = 0;

    constructor(props: IntervalsListProps){
        super(props);

        this.numIntervals = this.props.initialSize;

        //set the initial intervals based on the props.
        for(var i = 0; i < this.numIntervals; i++){
            this.intervalComponents.push(<Grid item key = {i}> <IntervalField key = {i} store = {this.props.store} intervalIndex = {i}/> </Grid>)
            this.props.store.intervals.push("");
        }

        this.addInterval = this.addInterval.bind(this);
        this.removeInterval = this.removeInterval.bind(this);
    }

    addInterval(){
        const nextItemIndex: number = this.props.store.intervals.length;
        this.intervalComponents.push(<Grid item key = {nextItemIndex}> <IntervalField key = {nextItemIndex} store = {this.props.store} intervalIndex = {nextItemIndex}/> </Grid>)
        this.props.store.intervals.push("");
    }

    removeInterval(){
        this.props.store.intervals.pop();
        this.intervalComponents.pop();
    }

    render(){
        const intervalFields = this.intervalComponents.map(comp => {return comp});
        return(
            <Grid container direction = "row" justify = "center" alignItems = "center" spacing = {1}>
                {intervalFields}

                <Grid item>
                    <Tooltip title = "Remove an interval">
                        <IconButton size = "medium" color = "primary" onClick = {this.removeInterval}>
                            <Icon>remove</Icon>
                        </IconButton>
                    </Tooltip>
                </Grid>

                <Grid item>
                    <Tooltip title = "Add an interval">
                        <IconButton size = "medium" color = "primary" onClick = {this.addInterval}>
                            <Icon>add</Icon>
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
        )
    }
}
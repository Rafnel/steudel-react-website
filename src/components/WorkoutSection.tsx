import { Grid, Typography, IconButton, Tooltip } from "@material-ui/core";
import React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { SwimWorkoutPageStore } from "../containers/CreateSwimWorkoutPage";
import WorkoutSwimComponent from "./swimcomponents/WorkoutSwimComponent";
import AddIcon from '@material-ui/icons/Add';
import { emptySwimComponent } from "../configuration/appState";

export interface WorkoutSectionProps{
    sectionTitle: string;
    initialComponentCount: number;
    pageStore: SwimWorkoutPageStore;
}

@observer
export default class WorkoutSection extends React.Component<WorkoutSectionProps>{
    @observable componentRows: any[] = [];
    @observable numComponents: number = 0;

    constructor(props: WorkoutSectionProps){
        super(props);

        this.numComponents = this.props.initialComponentCount;
        
        //set the initial empty swim component rows based on the number of initial components.
        for(var i = 0; i < this.numComponents; i++){
            this.componentRows.push(<Grid item key = {i}> <WorkoutSwimComponent key = {i} store = {this.props.pageStore} indexOfComponentsArray = {this.props.pageStore.nextIndex}/> </Grid>)
            this.props.pageStore.swimComponents.push(emptySwimComponent());
            this.props.pageStore.swimComponents[this.props.pageStore.nextIndex].set = this.props.sectionTitle;
            this.props.pageStore.nextIndex++;
        }

        this.addComponentToSection = this.addComponentToSection.bind(this);
    }

    addComponentToSection(){
        console.log(":: Adding empty component for section " + this.props.sectionTitle + " at index " + this.props.pageStore.nextIndex);
        //provision a new swimcomponent row
        this.componentRows.push(<Grid item key = {this.numComponents}> <WorkoutSwimComponent key = {this.numComponents} store = {this.props.pageStore} indexOfComponentsArray = {this.props.pageStore.nextIndex}/> </Grid>)
        this.props.pageStore.swimComponents.push(emptySwimComponent())
        this.props.pageStore.swimComponents[this.props.pageStore.nextIndex].set = this.props.sectionTitle;
        this.props.pageStore.nextIndex++;

        //add to number of components counter for this section
        this.numComponents++;

        console.log(":: size of component rows " + this.componentRows.length);
        console.log(":: Number of components " + this.numComponents);
    }

    render(){
        console.log("Rendering section " + this.props.sectionTitle + " with rows " + this.componentRows.length);
        const items = this.componentRows.map((row) => {return row});
        return(
            <Grid spacing = {2} container alignItems = "center" justify = "center" direction = "column">
                <Grid item>
                    <Typography variant = "h4">
                        {this.props.sectionTitle}
                    </Typography>
                </Grid>

                {items}

                <Grid item>
                    <Tooltip title = "Add a component to this section">
                        <IconButton size = "medium" color = "primary" onClick = {this.addComponentToSection}>
                            <AddIcon/>
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
        )
    }
}
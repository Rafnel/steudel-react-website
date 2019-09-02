import React, { Fragment } from "react";
import { SwimComponent } from "../../configuration/appState";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { Typography, Grid, CircularProgress, Divider } from "@material-ui/core";
import OneLineSwimComponent from "./OneLineSwimComponent";
import getComponentByID from "../../api/getComponentByID";

export interface WorkoutSetProps{
    components: string[];
    setName: string;
}

@observer
export default class WorkoutSet extends React.Component<WorkoutSetProps>{
    @observable loadingComponents: boolean = true;
    @observable components: any[] = [];
    async getSetComponents(){
        for(var i = 0; i < this.props.components.length; i++){
            let items: string[] = this.props.components[i].split(",");
            let username: string = items[0];
            let id: string = items[1];

            const component: SwimComponent = await getComponentByID(username, id);
            this.components.push(<Grid item key = {component.component_id}> <OneLineSwimComponent key = {component.component_id} component = {component}/> </Grid>)
        }

        this.loadingComponents = false;
    }
    renderComponents(){
        if(this.loadingComponents){
            return <CircularProgress/>
        }
        else{
            return this.components;
        }
    }
    render(){
        return(
            <Fragment>
                <Grid container direction = "column" alignItems = "center" justify = "center">
                    <Typography variant = "h4">
                        {this.props.setName}
                    </Typography>
                </Grid>

                &nbsp;

                <Grid container direction = "column" alignItems = "flex-start" justify = "flex-start" spacing = {2}>
                    {this.renderComponents()}
                </Grid>

                <Divider/>
            </Fragment>
        )
    }

    componentDidMount(){
        this.getSetComponents();
    }
}
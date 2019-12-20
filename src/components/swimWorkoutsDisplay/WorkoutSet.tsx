import React, { Fragment } from "react";
import { SwimComponent } from "../../configuration/appState";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { Typography, Grid, CircularProgress, Divider } from "@material-ui/core";
import OneLineSwimComponent from "./OneLineSwimComponent";
import getComponentByID from "../../api/getComponentByID";
import BeatLoader from 'react-spinners/BeatLoader';
import { PRIMARY } from "../..";

export interface WorkoutSetProps{
    components: string[];
    setName: string;
}

//updated
@observer
export default class WorkoutSet extends React.Component<WorkoutSetProps>{
    @observable loadingComponents: boolean = true;
    components: any[] = [];
    async getSetComponents(){
        for(var i = 0; i < this.props.components.length; i++){
            let items: string[] = this.props.components[i].split(",");
            let username: string = items[0];
            let id: string = items[1];

            const component: SwimComponent = await getComponentByID(username, id);
            this.components.push(
                <Grid 
                    item 
                    key = {component.component_id}
                    style = {{width: "100%"}}
                > 
                    <OneLineSwimComponent key = {component.component_id} component = {component}/> 
                </Grid>
            )
        }

        this.loadingComponents = false;
    }
    renderComponents(){
        if(this.loadingComponents){
            return <BeatLoader color = {PRIMARY}/>
        }
        else{
            return this.components;
        }
    }
    render(){
        return(
            <Fragment>
                <Grid container direction = "column" alignItems = "center" justify = "center">
                    <Typography variant = "h5">
                        {this.props.setName}
                    </Typography>
                </Grid>

                &nbsp;

                {this.loadingComponents && 
                 <Grid container direction = "column" alignItems = "center" justify = "center">
                    {this.renderComponents()}
                 </Grid>
                }

                {!this.loadingComponents && 
                 <Grid style = {{width: "100%"}} container direction = "column" alignItems = "flex-start" justify = "flex-start">
                    {this.renderComponents()}
                 </Grid>
                }

                {!this.loadingComponents && <Divider style = {{backgroundColor: "#000000"}}/>}
            </Fragment>
        )
    }

    componentDidMount(){
        this.getSetComponents();
    }
}
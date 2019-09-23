import React from "react";
import { SwimWorkout } from "../../configuration/appState";
import WorkoutSet from "./WorkoutSet";
import { observer } from "mobx-react";
import { Grid, Button, Paper, Container, Box } from "@material-ui/core";
import { RouteComponentProps, withRouter } from "react-router";

export interface SwimWorkoutProps extends RouteComponentProps<any>{
    workout: SwimWorkout;
}

@observer
class SwimWorkoutComponent extends React.Component<SwimWorkoutProps>{
    getWorkoutSections(){
        let sections = [];
        if(this.props.workout.warmup.length > 0){
            sections.push(<WorkoutSet key = "Warmup" setName = "Warmup" components = {this.props.workout.warmup}/>);
        }
        if(this.props.workout.preset.length > 0){
            sections.push(<WorkoutSet key = "Pre Set" setName = "Pre Set" components = {this.props.workout.preset}/>);
        }
        if(this.props.workout.mainset.length > 0){
            sections.push(<WorkoutSet key = "Main Set" setName = "Main Set" components = {this.props.workout.mainset}/>);
        }
        if(this.props.workout.cooldown.length > 0){
            sections.push(<WorkoutSet key = "Cooldown" setName = "Cooldown" components = {this.props.workout.cooldown}/>);
        }

        return sections;
    }
    linkButton(){
        return(
            <Button
                onClick = {() => this.props.history.push("/workout/" + this.props.workout.username + "/" + this.props.workout.workout_id)}
            >
                <b> {this.props.workout.yardage} </b>
            </Button>
        )
    }
    render(){
        return(
            <Container maxWidth = "md" component = "main">
                <Paper style = {{padding: 10, backgroundColor: "#FFFFFF"}}>
                    <div id = "workout">
                        <Grid container direction = "column" spacing = {2}>
                            <Grid item>
                                {this.getWorkoutSections()}
                            </Grid>

                            <Grid container alignItems = "flex-end" justify = "flex-end">
                                <Grid item>
                                    {this.linkButton()} 
                                </Grid>
                            </Grid>
                        </Grid>     
                    </div>
                </Paper>
            </Container>
            
        )
    }
}

export default withRouter<SwimWorkoutProps, any>(SwimWorkoutComponent);
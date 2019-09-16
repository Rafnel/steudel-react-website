import { Button, Chip, Divider, Grid, Icon, Typography } from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';
import { observable } from "mobx";
import { observer } from "mobx-react";
import React, { Fragment } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import BeatLoader from 'react-spinners/BeatLoader';
import { PRIMARY } from "../..";
import { getLoggedInUserWorkouts } from "../../configuration/getUserData";
import { globalState } from "../../configuration/appState";

@observer
class WorkoutsHub extends React.Component<RouteComponentProps<any>>{
    @observable loadingWorkouts: boolean = true;

    async getWorkouts(){
        await getLoggedInUserWorkouts();
        this.loadingWorkouts = false;
    }

    render(){
        return(
            <Fragment>
                <Grid container justify = "center" alignItems = "center" spacing = {2} direction = "column">
                    <Grid item>
                        <Typography variant = "h4">
                            Workouts
                        </Typography>
                    </Grid>

                    {this.loadingWorkouts && <BeatLoader color = {PRIMARY}/>}
                    {!this.loadingWorkouts
                     &&
                     <Grid item>
                        <Chip
                            color = "secondary"
                            icon = {<EditIcon/>}
                            label = {"Workouts Created: " + globalState.mySwimWorkouts.length}
                        />
                     </Grid>
                    }

                    <Grid item>
                        <Grid container direction = "row" spacing = {1}>
                            <Grid item>
                                <Button
                                    color = "primary"
                                    style = {{textTransform: "initial"}}
                                    variant = "outlined"
                                    onClick = {() => {
                                        this.props.history.push("/create-swim-workout");
                                    }}
                                >
                                    <Icon>edit</Icon>
                                    Create
                                </Button>
                            </Grid>

                            <Grid item>
                                <Button
                                    color = "primary"
                                    style = {{textTransform: "initial"}}
                                    variant = "outlined"
                                    onClick = {() => {
                                        this.props.history.push("/my-workouts");
                                    }}
                                >
                                    <Icon>library_books</Icon>
                                    My Workouts
                                </Button>
                            </Grid>
                            
                        </Grid>
                    </Grid>
                </Grid>  

                &nbsp;

                <Divider/>
            </Fragment>
        )
    }

    componentDidMount(){
        this.getWorkouts();
    }
}

export default withRouter<RouteComponentProps<any>, any>(WorkoutsHub);
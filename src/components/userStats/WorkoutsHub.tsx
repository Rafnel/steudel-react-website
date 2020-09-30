import { Button, Chip, Divider, Grid, Icon, Typography } from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';
import { observable } from "mobx";
import { observer, inject } from "mobx-react";
import React, { Fragment } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import BeatLoader from 'react-spinners/BeatLoader';
import { PRIMARY } from "../..";
import UserStateStore from "../../configuration/stateStores/userStateStore";
import getAllWorkoutsFromUser from "../../api/getAllWorkoutsFromUser";
import PoolIcon from '@material-ui/icons/Pool';

export interface WorkoutsHubProps{
    userState?: UserStateStore;
}

//updated
@inject("userState")
@observer
class WorkoutsHub extends React.Component<RouteComponentProps<any> & WorkoutsHubProps>{
    @observable loadingWorkouts: boolean = true;

    get userState(){
        return this.props.userState as UserStateStore;
    }

    async getWorkouts(){
        this.userState.mySwimWorkouts = await getAllWorkoutsFromUser(this.userState.currentUser.username);
        this.userState.needToUpdateSwimWorkouts = false;
        this.loadingWorkouts = false;
    }

    render(){
        return(
            <Fragment>
                <Grid container justify = "center" alignItems = "center" spacing = {2} direction = "column">
                    <Grid item>
                        <Typography variant = "h6">
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
                            label = {"Workouts Created: " + this.userState.mySwimWorkouts.length}
                        />
                     </Grid>
                    }

                    <Grid item>
                        <Grid container direction = "row" justify = "center" alignItems = "center" spacing = {1}>
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

                            <Grid item>
                                <Button
                                    color = "primary"
                                    style = {{textTransform: "initial"}}
                                    variant = "outlined"
                                    href = "/folder/Rafnel/main"
                                >
                                    <PoolIcon/>
                                    View Coach Zac's Workouts
                                </Button>
                            </Grid>
                            
                        </Grid>
                    </Grid>
                </Grid>  

                &nbsp;

                <div style = {{width: "100%"}}>
                    <Divider/>
                </div>

            </Fragment>
        )
    }

    componentDidMount(){
        this.getWorkouts();
    }
}

export default withRouter<RouteComponentProps<any> & WorkoutsHubProps, any>(WorkoutsHub);
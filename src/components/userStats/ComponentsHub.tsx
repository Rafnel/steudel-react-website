import { Typography, Grid, Divider, Button, Icon, Chip } from "@material-ui/core";
import React, { Fragment } from "react";
import { observable } from "mobx";
import { observer, inject } from "mobx-react";
import getAllComponentsFromUser from "../../api/getAllComponentsFromUser";
import { PRIMARY } from "../..";
import BeatLoader from 'react-spinners/BeatLoader';
import { RouteComponentProps, withRouter } from "react-router";
import FavoriteIcon from '@material-ui/icons/Favorite';
import EditIcon from '@material-ui/icons/Edit';
import UserStateStore from "../../configuration/stateStores/userStateStore";

export interface ComponentsHubProps{
    userState?: UserStateStore;
}

//updated
@inject("userState")
@observer
class ComponentsHub extends React.Component<RouteComponentProps<any> & ComponentsHubProps>{
    @observable loadingComponents: boolean = true;
    @observable likes: number = 0;

    get userState(){
        return this.props.userState as UserStateStore;
    }

    async getComponents(){
        this.userState.mySwimComponents = await getAllComponentsFromUser(this.userState.currentUser.username);
        this.userState.needToUpdateSwimComponents = false;

        if(this.userState.mySwimComponents === null){
            this.userState.mySwimComponents = [];
        }
        await this.getLikes();
        this.loadingComponents = false;
    }

    async getLikes(){
        for(let i = 0; i < this.userState.mySwimComponents.length; i++){
            this.likes += this.userState.mySwimComponents[i].likes;
        }
    }

    render(){
        return(
            <Fragment>
                <Grid container justify = "center" alignItems = "center" spacing = {2} direction = "column">
                    <Grid item>
                        <Typography variant = "h6">
                            Components
                        </Typography>
                    </Grid>

                    {this.loadingComponents && <BeatLoader color = {PRIMARY}/>}

                    {!this.loadingComponents
                     &&
                     <Grid item>
                         <Chip
                            color = "secondary"
                            icon = {<EditIcon/>}
                            label = {"Components Created: " + this.userState.mySwimComponents.length}
                         />
                     </Grid>
                    }

                    {!this.loadingComponents
                     &&
                     <Grid item>
                         <Chip
                            color = "secondary"
                            icon = {<FavoriteIcon/>}
                            label = {"Total Likes: " + this.likes}
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
                                        this.props.history.push("/create-swim-component");
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
                                        this.props.history.push("/swim-components");
                                    }}
                                >
                                    <Icon>explore</Icon>
                                    Explore
                                </Button>
                            </Grid>
                        </Grid>   
                    </Grid>
                </Grid>  
            </Fragment>
        )
    }

    componentDidMount(){
        this.getComponents();
    }
}

export default withRouter<RouteComponentProps<any> & ComponentsHubProps, any>(ComponentsHub);
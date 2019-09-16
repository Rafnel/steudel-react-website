import { Typography, Grid, Divider, Button, Icon, Chip } from "@material-ui/core";
import React, { Fragment } from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import getAllComponentsFromUser from "../../api/getAllComponentsFromUser";
import { globalState } from "../../configuration/appState";
import { PRIMARY } from "../..";
import BeatLoader from 'react-spinners/BeatLoader';
import { RouteComponentProps, withRouter } from "react-router";
import FavoriteIcon from '@material-ui/icons/Favorite';
import EditIcon from '@material-ui/icons/Edit';
import { getLoggedInUserComponents } from "../../configuration/getUserData";

@observer
class ComponentsHub extends React.Component<RouteComponentProps<any>>{
    @observable loadingComponents: boolean = true;
    @observable likes: number = 0;

    async getComponents(){
        await getLoggedInUserComponents();
        if(globalState.mySwimComponents === null){
            globalState.mySwimComponents = [];
        }
        await this.getLikes();
        this.loadingComponents = false;
    }

    async getLikes(){
        for(let i = 0; i < globalState.mySwimComponents.length; i++){
            this.likes += globalState.mySwimComponents[i].likes;
        }
    }

    render(){
        return(
            <Fragment>
                <Grid container justify = "center" alignItems = "center" spacing = {2} direction = "column">
                    <Grid item>
                        <Typography variant = "h4">
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
                            label = {"Components Created: " + globalState.mySwimComponents.length}
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

                &nbsp;
                <Divider/>
            </Fragment>
        )
    }

    componentDidMount(){
        this.getComponents();
    }
}

export default withRouter<RouteComponentProps<any>, any>(ComponentsHub);
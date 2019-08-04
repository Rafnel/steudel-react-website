import { Card, CardActions, CardContent, CardHeader, Divider, Grid, Icon, IconButton, Typography } from "@material-ui/core";
import { green } from "@material-ui/core/colors";
import { observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import updateComponentLikes from "../api/updateComponentLikes";
import updateUser from "../api/updateUser";
import { globalState, User } from "../stateStores/appState";

@observer
export default class SwimComponentCard extends React.Component{
    isComponentLiked(): boolean{
        const user: User = globalState.appState.currentUser;
        for(let i = 0; i < user.liked_components.length; i++){
            if(user.liked_components[i].includes(globalState.appState.currentComponent.component_id)){
                return true;
            }
        }

        return false;
    }
    @observable componentLiked: boolean = this.isComponentLiked();
    render(){
        return(
            <Card style = {{maxWidth: 400, backgroundColor: green[50]}}>
                <CardHeader
                    title = {globalState.appState.currentComponent.username + "'s " + globalState.appState.currentComponent.set + " Component"}
                    subheader = {"Created on " + globalState.appState.currentComponent.date_created.split(",")[0]}
                />
                <CardContent>
                    <Grid container direction = "column">
                        <Grid item>
                            <Typography variant = "body1">
                                {globalState.appState.currentComponent.component_body}
                            </Typography>
                        </Grid>

                        <Grid item>
                            <Typography variant = "body2">
                                {"Interval" + (globalState.appState.currentComponent.intervals.length > 1 ? "s" : "") + ": " + globalState.appState.currentComponent.intervals.join(" / ")}
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>

                <Divider/>

                <CardActions>
                    <IconButton 
                        color = "primary" 
                        onClick = {() => {
                            this.componentLiked = !this.componentLiked;
                            var value: number;
                            let componentLikeString: string = globalState.appState.currentComponent.username + "," + globalState.appState.currentComponent.component_id;
                            if(!this.componentLiked){
                                globalState.appState.currentComponent.likes -= 1;
                                value = -1;
                                globalState.appState.currentUser.liked_components = globalState.appState.currentUser.liked_components.filter(comp => comp !== componentLikeString);
                                updateUser(globalState.appState.currentUser);
                            }
                            else{
                                globalState.appState.currentComponent.likes += 1;
                                value = 1;
                                globalState.appState.currentUser.liked_components.push(componentLikeString);
                                updateUser(globalState.appState.currentUser);
                            }

                            //this needs to become atomic in some way TODO
                            updateComponentLikes(globalState.appState.currentComponent, value);
                        }}
                    >
                        {this.componentLiked && <Icon>favorite</Icon>}
                        {!this.componentLiked && <Icon>favorite_border</Icon>}
                    </IconButton>

                    <Grid container justify = "flex-start">
                        <Typography variant = "subtitle2">
                            {globalState.appState.currentComponent.likes}
                            {(globalState.appState.currentComponent.likes === 0 || globalState.appState.currentComponent.likes > 1) && " likes"}
                            {globalState.appState.currentComponent.likes === 1 && " like"}
                        </Typography>
                    </Grid>

                    <Grid container justify = "flex-end">
                        <Typography variant = "subtitle2">
                            {"Total yardage: " + globalState.appState.currentComponent.yardage}
                        </Typography>
                    </Grid>
                </CardActions>
            </Card>
        )
    }

    componentDidUpdate(){
        if(this.componentLiked !== this.isComponentLiked()){
            this.componentLiked = !this.componentLiked;
        }
    }
}
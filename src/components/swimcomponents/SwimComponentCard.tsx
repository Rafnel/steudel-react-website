import { Card, CardActions, CardContent, CardHeader, Divider, Grid, Icon, IconButton, Typography } from "@material-ui/core";
import { green } from "@material-ui/core/colors";
import { observable } from "mobx";
import { observer, inject } from "mobx-react";
import React, { Fragment } from "react";
import updateComponentLikes from "../../api/updateComponentLikes";
import updateUser from "../../api/updateUser";
import { User, SwimComponent } from "../../configuration/appState";
import UserStateStore from "../../configuration/stateStores/userStateStore";

export interface SwimComponentCardProps{
    currentComponent: SwimComponent;
    userState?: UserStateStore;
}

//updated
@inject("userState")
@observer
export default class SwimComponentCard extends React.Component<SwimComponentCardProps>{
    isComponentLiked(): boolean{
        const user: User = this.userState.currentUser;
        for(let i = 0; i < user.liked_components.length; i++){
            if(user.liked_components[i].includes(this.props.currentComponent.component_id)){
                return true;
            }
        }

        return false;
    }

    get userState(){
        return this.props.userState as UserStateStore;
    }

    @observable componentLiked: boolean = this.isComponentLiked();
    render(){
        return(
            <Card style = {{maxWidth: 400, backgroundColor: green[50]}}>
                <CardHeader
                    title = {this.props.currentComponent.username + "'s " + this.props.currentComponent.set + " Component"}
                    subheader = {"Created on " + this.props.currentComponent.date_created.split(",")[0]}
                />
                <CardContent>
                    <Grid container direction = "column">
                        <Grid item>
                            <Typography variant = "body1">
                                {this.props.currentComponent.component_body.split("\n").map((component) => {return <Fragment>{component}<br/></Fragment>})}
                            </Typography>
                        </Grid>

                        <Grid item>
                            <Typography variant = "body2">
                                {this.props.currentComponent.intervals.length !== 0 && "Interval" + (this.props.currentComponent.intervals.length > 1 ? "s" : "") + ": " + this.props.currentComponent.intervals.join(" / ")}
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
                            let componentLikeString: string = this.props.currentComponent.username + "," + this.props.currentComponent.component_id;
                            if(!this.componentLiked){
                                this.props.currentComponent.likes -= 1;
                                value = -1;
                                this.userState.currentUser.liked_components = this.userState.currentUser.liked_components.filter(comp => comp !== componentLikeString);
                                updateUser(this.userState.currentUser);
                            }
                            else{
                                this.props.currentComponent.likes += 1;
                                value = 1;
                                this.userState.currentUser.liked_components.push(componentLikeString);
                                updateUser(this.userState.currentUser);
                            }

                            //this needs to become atomic in some way TODO
                            updateComponentLikes(this.props.currentComponent, value);
                        }}
                    >
                        {this.componentLiked && <Icon>favorite</Icon>}
                        {!this.componentLiked && <Icon>favorite_border</Icon>}
                    </IconButton>

                    <Grid container justify = "flex-start">
                        <Typography variant = "subtitle2">
                            {this.props.currentComponent.likes}
                            {(this.props.currentComponent.likes === 0 || this.props.currentComponent.likes > 1) && " likes"}
                            {this.props.currentComponent.likes === 1 && " like"}
                        </Typography>
                    </Grid>

                    <Grid container justify = "flex-end">
                        <Typography variant = "subtitle2">
                            {"Total yardage: " + this.props.currentComponent.yardage}
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
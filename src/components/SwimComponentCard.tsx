import React from "react";
import AppStateStore from "../stateStores/appState";
import { Card, CardHeader, CardContent, Typography } from "@material-ui/core";
import { PRIMARY, SECONDARY } from "..";
import { observer } from "mobx-react";
import { green } from "@material-ui/core/colors";

export interface SwimComponentCardProps{
    appState: AppStateStore;
}

@observer
export default class SwimComponentCard extends React.Component<SwimComponentCardProps>{
    render(){
        return(
            <Card style = {{maxWidth: 400, backgroundColor: green[50]}}>
                <CardHeader
                    title = {this.props.appState.currentComponent.username + "'s " + this.props.appState.currentComponent.set + " Component"}
                    subheader = {"Created on " + this.props.appState.currentComponent.date_created.split(",")[0]}
                />
                <CardContent>
                    <Typography variant = "body1">
                        {this.props.appState.currentComponent.component_body}
                    </Typography>
                    <Typography variant = "body2">
                        {"Interval" + (this.props.appState.currentComponent.intervals.length > 1 ? "s" : "") + ": " + this.props.appState.currentComponent.intervals.join(" / ")}
                    </Typography>
                    <Typography variant = "subtitle2">
                        {"Total yardage: " + this.props.appState.currentComponent.yardage}
                    </Typography>
                </CardContent>
            </Card>
        )
    }
}
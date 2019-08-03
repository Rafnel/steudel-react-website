import React from "react";
import AppStateStore, { appState } from "../stateStores/appState";
import { Card, CardHeader, CardContent, Typography, CircularProgress } from "@material-ui/core";
import { PRIMARY, SECONDARY } from "..";
import { observer } from "mobx-react";
import { green } from "@material-ui/core/colors";

@observer
export default class SwimComponentCard extends React.Component{
    render(){
        return(
            <Card style = {{maxWidth: 400, backgroundColor: green[50]}}>
                <CardHeader
                    title = {appState.currentComponent.username + "'s " + appState.currentComponent.set + " Component"}
                    subheader = {"Created on " + appState.currentComponent.date_created.split(",")[0]}
                />
                <CardContent>
                    <Typography variant = "body1">
                        {appState.currentComponent.component_body}
                    </Typography>
                    <Typography variant = "body2">
                        {"Interval" + (appState.currentComponent.intervals.length > 1 ? "s" : "") + ": " + appState.currentComponent.intervals.join(" / ")}
                    </Typography>
                    <Typography variant = "subtitle2">
                        {"Total yardage: " + appState.currentComponent.yardage}
                    </Typography>
                </CardContent>
            </Card>
        )
    }
}
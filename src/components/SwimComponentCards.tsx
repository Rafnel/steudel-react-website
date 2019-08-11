import React from "react";
import { Grid } from "@material-ui/core";
import { SwimComponent } from "../stateStores/appState";
import SwimComponentCard from "./SwimComponentCard";

export interface SwimComponentCardsProps{
    components: SwimComponent[]
}

export default class SwimComponentCards extends React.Component<SwimComponentCardsProps>{
    render(){
        const items = this.props.components.map(component => <Grid item> <SwimComponentCard currentComponent = {component}/> </Grid>)
        return(
            <Grid container spacing = {2} alignItems = "center" direction = "row" justify = "center">
                {items}
            </Grid>
        )
    }
}
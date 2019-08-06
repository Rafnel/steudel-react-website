import React, { ChangeEvent } from "react";
import { Grid, Typography, Paper, Tabs, Tab, CircularProgress } from "@material-ui/core";
import { observer } from "mobx-react";
import { observable } from "mobx";
import SwimComponentCards from "../components/SwimComponentCards";
import { SwimComponent, globalState } from "../stateStores/appState";
import getSortedSwimComponentsBySet from "../api/getSortedSwimComponentsBySet";

@observer
export default class SwimComponentsPage extends React.Component{
    @observable activeTab: number = 0;
    @observable activeList: SwimComponent[] = [];

    async retrieveComponentList(){
        globalState.appState.isLoading = true;
        let set: string = "";
        if(this.activeTab === 0){
            set = "Warmup";
        }
        else if(this.activeTab === 1){
            set = "Pre Set";
        }
        else if(this.activeTab === 2){
            set = "Main Set";
        }
        else if(this.activeTab === 3){
            set = "Cooldown";
        }
        let swimComponents: SwimComponent[] = await getSortedSwimComponentsBySet(set);
        this.activeList = swimComponents;

        globalState.appState.isLoading = false;
    }
    
    render(){
        return(
            <div style = {{flexGrow: 1}}>
                <Grid spacing = {2} container justify = "center" alignItems = "center" direction = "column">
                    <Grid item>
                        <Typography variant = "h3">
                            Community Favorite Components
                        </Typography>
                    </Grid>

                    <Grid item>
                        <Typography variant = "h6">
                            Browse this page for the most liked components
                            in the community, sorted by set!
                        </Typography>
                    </Grid>

                    <Grid item>
                        <Paper style = {{padding: 10}}>
                            <Grid container spacing = {2} alignItems = "center" justify = "center" direction = "column">
                                <Grid item>
                                    <Tabs
                                        centered
                                        value = {this.activeTab}
                                        indicatorColor = "primary"
                                        onChange = {(event: ChangeEvent<{}>, value: number) => {
                                            this.activeTab = value;
                                            console.log(":: Value of active tab is " + this.activeTab);
                                            this.retrieveComponentList();
                                        }}
                                    >
                                        <Tab label = "Warmup"/>
                                        <Tab label = "Pre Set"/>
                                        <Tab label = "Main Set"/>
                                        <Tab label = "Cooldown"/>
                                    </Tabs>
                                </Grid>

                                <Grid item>
                                    {globalState.appState.isLoading && <CircularProgress/>}
                                </Grid>

                                <Grid item>
                                    {!globalState.appState.isLoading && <SwimComponentCards components = {this.activeList}/>}
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </div> 
        )
    }

    async componentDidMount(){
        this.retrieveComponentList();
    }
}
import React, { ChangeEvent } from "react";
import { Grid, Typography, Paper, Tabs, Tab, CircularProgress } from "@material-ui/core";
import { observer, inject } from "mobx-react";
import { observable } from "mobx";
import { SwimComponent } from "../configuration/appState";
import getSortedSwimComponentsBySet from "../api/getSortedSwimComponentsBySet";
import SwimComponentCards from "../components/swimcomponents/SwimComponentCards";
import { PRIMARY } from "..";
import SyncLoader from 'react-spinners/SyncLoader';
import { AppStateStore } from "../configuration/stateStores/appStateStore";

export interface SwimComponentsPageProps{
    appState?: AppStateStore;
}

@inject("appState")
@observer
export default class SwimComponentsPage extends React.Component<SwimComponentsPageProps>{
    @observable activeTab: number = 0;
    @observable activeList: SwimComponent[] = [];

    get appState(){
        return this.props.appState as AppStateStore;
    }

    async retrieveComponentList(){
        this.appState.isLoading = true;
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

        this.appState.isLoading = false;
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
                                    {this.appState.isLoading && <SyncLoader size = {20} color = {PRIMARY}/>}
                                </Grid>

                                <Grid item>
                                    {!this.appState.isLoading && <SwimComponentCards components = {this.activeList}/>}
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
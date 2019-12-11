import { AppBar, Toolbar } from "@material-ui/core";
import { Auth } from "aws-amplify";
import { observer, inject } from "mobx-react";
import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import CreateButton from "./buttons/CreateButton";
import HomeButton from "./buttons/HomeButton";
import ExploreButton from "./buttons/ExploreButton";
import AccountButton from "./buttons/AccountButton";
import QuestionButton from "./buttons/QuestionButton";
import { AppStateStore } from "../configuration/stateStores/appStateStore";

export interface HeaderBarProps{
    appState?: AppStateStore;
}

//updated
@inject("appState")
@observer
class HeaderBar extends React.Component<RouteComponentProps<any> & HeaderBarProps>{
    get appState(){
        return this.props.appState as AppStateStore;
    }

    render(){
        return(
            <AppBar position = "sticky">
                <Toolbar>
                    <HomeButton/>

                    {this.appState.isLoggedIn && <ExploreButton/>}

                    {this.appState.isLoggedIn && <CreateButton/>}

                    <span style = {{marginLeft: "auto", marginRight: -12}}>
                        <AccountButton/>
                        <QuestionButton/>
                    </span>
                </Toolbar>
            </AppBar>
        )
    }
}

export default withRouter<RouteComponentProps<any> & HeaderBarProps, any>(HeaderBar);
